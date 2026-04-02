import { InventoryReadModel } from "../../models/inventory-read.model";

export class ProductListResponseDto {
  static fromModel(model: InventoryReadModel): ProductListResponseDto {
    const dto = new ProductListResponseDto();
    dto.id = model.id;
    dto.name = model.name;
    dto.stock = model.stock;
    dto.price = model.price;
    dto.createdAt = model.createdAt;
    return dto;
  }

  id: string;
  name: string;
  stock: number;
  price: number;
  createdAt: Date;
}