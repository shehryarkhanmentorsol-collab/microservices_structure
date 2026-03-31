import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from './dto/request/register-request.dto';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { RegisterResponseDto } from './dto/response/register-response.dto';
import { LoginResponseDto } from './dto/response/login-response.dto';
import { RegisterModel } from './models/register.model';
import { LoginModel } from './models/login.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const model = RegisterModel.fromDto(dto);
    const result = await this.authService.register(model);
    return RegisterResponseDto.fromModel(result);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginRequestDto): Promise<LoginResponseDto> {
    const model = LoginModel.fromDto(dto);
    const result = await this.authService.login(model);
    return LoginResponseDto.fromModel(result);
  }
}