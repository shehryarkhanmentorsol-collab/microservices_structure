import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
 
export type InventoryDocument = HydratedDocument<Inventory>;
 
@Schema({ timestamps: true })  // auto-adds createdAt + updatedAt
export class Inventory {
  @Prop({ required: true })
  name: string;
 
  @Prop()
  description: string;
 
  @Prop({ required: true, default: 0 })
  stock: number;
 
  @Prop({ required: true })
  price: number;
}
 
export const InventorySchema = SchemaFactory.createForClass(Inventory);