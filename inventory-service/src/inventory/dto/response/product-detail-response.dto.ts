import { InventoryReadModel } from "../../models/inventory-read.model";

export class ProductDetailResponseDto {
  static fromModel(model: InventoryReadModel): ProductDetailResponseDto {
    const dto = new ProductDetailResponseDto();
    dto.id = model.id;
    dto.name = model.name;
    dto.description = model.description;
    dto.stock = model.stock;
    dto.price = model.price;
    dto.createdAt = model.createdAt;
    return dto;
  }

  id: string;
  name: string;
  description: string;
  stock: number;
  price: number;
  createdAt: Date;
}