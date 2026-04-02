import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InventoryReadModel } from '../../../../inventory/models/inventory-read.model';
import { CreateProductModel } from '../../../../inventory/models/create-product.model';
import { Inventory, InventoryDocument } from '../schema/inventory.schema';


@Injectable()
export class InventoryRepository {
  constructor(
    @InjectModel(Inventory.name)
    private readonly model: Model<InventoryDocument>,
  ) {}
 
  async findById(id: string): Promise<InventoryReadModel | null> {
    const item = await this.model.findById(id).exec();
    return item ? InventoryReadModel.fromDocument(item) : null;
  }
 
  async findAll(): Promise<InventoryReadModel[]> {
    const items = await this.model.find().exec();
    return items.map((i) => InventoryReadModel.fromDocument(i));
  }
 
  async create(model: CreateProductModel): Promise<InventoryReadModel> {
    try {
      const created = await this.model.create({
        name: model.name,
        description: model.description,
        stock: model.stock,
        price: model.price,
      });
      return InventoryReadModel.fromDocument(created);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create product');
    }
  }
 
  async updateStock(id: string, stock: number): Promise<InventoryReadModel> {
    const updated = await this.model
      .findByIdAndUpdate(id, { stock }, { new: true })  // new:true returns updated doc
      .exec();
 
    if (!updated) {
      throw new InternalServerErrorException(`Product ${id} not found after stock update`);
    }
    return InventoryReadModel.fromDocument(updated);
  }
}