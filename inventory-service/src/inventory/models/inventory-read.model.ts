import { InventoryEntity } from "../../common/database/inventory/entities/inventory.entity";

export class InventoryReadModel {
  static fromEntity(entity: InventoryEntity): InventoryReadModel {
    const model = new InventoryReadModel();
    model.id = entity.id;
    model.name = entity.name;
    model.description = entity.description;
    model.stock = entity.stock;
    model.price = entity.price;
    model.createdAt = entity.createdAt;
    return model;
  }

  id: string;
  name: string;
  description: string;
  stock: number;
  price: number;
  createdAt: Date;
}