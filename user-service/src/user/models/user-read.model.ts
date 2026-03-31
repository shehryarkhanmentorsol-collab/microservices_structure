import { UserRole } from '../enums/user.enum';
import { UserEntity } from '../../common/database/user/entities/user.entity';

export class UserReadModel {
  static fromEntity(entity: UserEntity): UserReadModel {
    const model = new UserReadModel();
    model.id = entity.id;
    model.name = entity.name;
    model.email = entity.email;
    model.password = entity.password;
    model.role = entity.role;
    model.createdAt = entity.createdAt;
    return model;
  }

  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
}