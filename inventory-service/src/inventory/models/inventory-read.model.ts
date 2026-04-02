import { InventoryDocument } from "../../common/database/inventory/schema/inventory.schema";

// ── KEY DIFFERENCE FROM MySQL/PostgreSQL VERSION ─────────────────
//
// MySQL/PostgreSQL:   UserReadModel.fromEntity(entity: UserEntity)
// MongoDB:            InventoryReadModel.fromDocument(doc: InventoryDocument)
//
// MongoDB _id is an ObjectId — we convert it to string with toString()
// MySQL/PostgreSQL id is already a string (uuid)
//
// Everything above this layer (service, controller, dto) stays identical.


export class InventoryReadModel {
  static fromDocument(doc: InventoryDocument): InventoryReadModel {
    const model = new InventoryReadModel();
    model.id = doc._id.toString();   // ObjectId → string
    model.name = doc.name;
    model.description = doc.description;
    model.stock = doc.stock;
    model.price = doc.price;
    model.createdAt = (doc as any).createdAt;
    return model;
  }

  id: string;
  name: string;
  description: string;
  stock: number;
  price: number;
  createdAt: Date;
}