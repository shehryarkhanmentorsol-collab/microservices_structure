import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateStockRequestDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stock: number;
}