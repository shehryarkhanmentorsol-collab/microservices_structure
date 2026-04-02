import { BadRequestException, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { BaseRepository, IQueryOptions } from "../../database.repository";
import { DATABASE_CONNECTION } from "../../database.consts";
import { DataSource } from "typeorm";
import { UserReadModel } from "../../../../user/models/user-read.model";
import { UserEntity } from "../entities/user.entity";
import * as bcrypt from 'bcrypt';
import { retry } from "rxjs";
import { RegisterModel } from "../../../../auth/models/register.model";

 
@Injectable()
export class UserRepository extends BaseRepository {
  constructor(@Inject(DATABASE_CONNECTION) dataSource: DataSource) {
    super(dataSource);
  }
 
  async findById(id: string, options?: IQueryOptions): Promise<UserReadModel | null> {
    const { entityManager } = this.parseOptions(options);
    const repo = entityManager.getRepository(UserEntity);
    const user = await repo.findOne({ where: { id } });
    return user ? UserReadModel.fromEntity(user) : null;
  }
 
  async findByEmail(email: string, options?: IQueryOptions): Promise<UserEntity | null> {
    const { entityManager } = this.parseOptions(options);
    const repo = entityManager.getRepository(UserEntity);
    return repo.findOne({ where: { email } });
  }
 
  async findAll(options?: IQueryOptions): Promise<UserReadModel[]> {
    const { entityManager } = this.parseOptions(options);
    const repo = entityManager.getRepository(UserEntity);
    const users = await repo.find({ select: ['id', 'name', 'email', 'role', 'createdAt'] });
    return users.map((u) => UserReadModel.fromEntity(u));
  }
 
  async create(model: RegisterModel, options?: IQueryOptions): Promise<UserReadModel> {
    const { entityManager } = this.parseOptions(options);
    const repo = entityManager.getRepository(UserEntity);
    try {
      const existing = await this.findByEmail(model.email);
      if (existing) throw new BadRequestException('Email already in use');
 
      const hashedPassword = await bcrypt.hash(model.password, 10);
      const entity = new UserEntity();
      entity.name = model.name;
      entity.email = model.email;
      entity.password = hashedPassword;
      entity.role = model.role;
 
      const saved = await repo.save(entity);
      return UserReadModel.fromEntity(saved);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Failed to create user');
    }
  }
 
  async validatePassword(entity: UserEntity, plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, entity.password);
  }
}