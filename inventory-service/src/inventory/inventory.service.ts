import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InventoryRepository } from '../common/database/inventory/repositories/inventory.repository';
import { InventoryReadModel } from './models/inventory-read.model';
import { CreateProductModel } from './models/create-product.model';
import { UpdateStockModel } from './models/update-stock.model';

// Service receives Models — DTOs are converted in the controller before reaching here.

@Injectable()
export class InventoryService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async findAll(): Promise<InventoryReadModel[]> {
    try {
      return await this.inventoryRepository.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve products');
    }
  }

  async findById(id: string): Promise<InventoryReadModel> {
    const item = await this.inventoryRepository.findById(id);
    if (!item) throw new NotFoundException(`Product ${id} not found`);
    return item;
  }

  async create(model: CreateProductModel): Promise<InventoryReadModel> {
    try {
      return await this.inventoryRepository.create(model);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create product');
    }
  }

  async updateStock(id: string, model: UpdateStockModel): Promise<InventoryReadModel> {
    const item = await this.inventoryRepository.findById(id);
    if (!item) throw new NotFoundException(`Product ${id} not found`);
    return await this.inventoryRepository.updateStock(id, model.stock);
  }
}