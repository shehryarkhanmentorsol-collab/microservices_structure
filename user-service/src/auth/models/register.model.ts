import { UserRole } from '../../user/enums/user.enum';
import { RegisterRequestDto } from '../dto/request/register-request.dto';
import { UserEntity } from '../../common/database/user/entities/user.entity';
import { UserReadModel } from '../../user/models/user-read.model';

export class RegisterModel {
  static fromDto(dto: RegisterRequestDto): RegisterModel {
    const model = new RegisterModel();
    model.name = dto.name;
    model.email = dto.email;
    model.password = dto.password;
    model.role = UserRole.USER;
    return model;
  }

  static fromEntity(entity: UserEntity): RegisterModel {
    const model = new RegisterModel();
    model.id = entity.id;
    model.name = entity.name;
    model.email = entity.email;
    model.role = entity.role;
    model.createdAt = entity.createdAt;
    return model;
  }

  static fromModel(model: UserReadModel): RegisterModel {
    const registerModel = new RegisterModel();
    registerModel.id = model.id;
    registerModel.name = model.name;
    registerModel.email = model.email;
    registerModel.role = model.role;
    registerModel.createdAt = model.createdAt;
    return registerModel;
  }

  id?: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt?: Date;
}