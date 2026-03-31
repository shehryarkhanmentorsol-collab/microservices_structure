import { LoginRequestDto } from '../dto/request/login-request.dto';

export class LoginModel {
  static fromDto(dto: LoginRequestDto): LoginModel {
    const model = new LoginModel();
    model.email = dto.email;
    model.password = dto.password;
    return model;
  }

  email: string;
  password?: string;
  accessToken?: string;
}