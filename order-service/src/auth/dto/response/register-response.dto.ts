import { UserRole } from "../../../user/enums/user.enum";
import { RegisterModel } from '../../models/register.model';

export class RegisterResponseDto {
  static fromModel(model: RegisterModel): RegisterResponseDto {
    const dto = new RegisterResponseDto();
    dto.id = model.id || '';
    dto.name = model.name;
    dto.email = model.email;
    dto.role = model.role;
    dto.createdAt = model.createdAt || new Date();
    return dto;
  }

  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}