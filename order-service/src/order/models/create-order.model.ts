import { IsString, IsUUID } from 'class-validator';

export class CreateOrderModel {
  @IsUUID()
  userId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;
}