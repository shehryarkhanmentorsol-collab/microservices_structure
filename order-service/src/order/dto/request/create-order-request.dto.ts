import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrderRequestDto {
  @IsNotEmpty()
  @IsString()
  userId: string;  

  @IsNotEmpty()
  @IsString()
  title: string;
  
  @IsOptional()
  @IsString()
  description?: string;
}