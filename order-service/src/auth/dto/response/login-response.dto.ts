import { LoginModel } from '../../models/login.model';

export class LoginResponseDto {
  static fromModel(model: LoginModel): LoginResponseDto {
    const dto = new LoginResponseDto();
    dto.accessToken = model.accessToken || '';
    return dto;
  }

  accessToken: string;
}