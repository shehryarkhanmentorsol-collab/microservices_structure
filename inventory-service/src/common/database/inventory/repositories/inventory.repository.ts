import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DATABASE_CONNECTION } from '../../database.consts';
import { InventoryEntity } from '../entities/inventory.entity';
import { InventoryReadModel } from '../../../../inventory/models/inventory-read.model';
import { CreateProductModel } from '../../../../inventory/models/create-product.model';
import { BaseRepository, IQueryOptions } from '../../base.repository';

@Injectable()
export class InventoryRepository extends BaseRepository {
  constructor(@Inject(DATABASE_CONNECTION) dataSource: DataSource) {
    super(dataSource);
  }

  async findById(id: string, options?: IQueryOptions): Promise<InventoryReadModel | null> {
    const { entityManager } = this.parseOptions(options);
    const repo = entityManager.getRepository(InventoryEntity);
    const item = await repo.findOne({ where: { id } });
    return item ? InventoryReadModel.fromEntity(item) : null;
  }

  async findAll(options?: IQueryOptions): Promise<InventoryReadModel[]> {
    const { entityManager } = this.parseOptions(options);
    const repo = entityManager.getRepository(InventoryEntity);
    const items = await repo.find();
    return items.map((i) => InventoryReadModel.fromEntity(i));
  }

  async create(model: CreateProductModel, options?: IQueryOptions): Promise<InventoryReadModel> {
    const { entityManager } = this.parseOptions(options);
    const repo = entityManager.getRepository(InventoryEntity);
    try {
      const entity = new InventoryEntity();
      entity.name = model.name;
      entity.description = model.description;
      entity.stock = model.stock;
      entity.price = model.price;
      const saved = await repo.save(entity);
      return InventoryReadModel.fromEntity(saved);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create product');
    }
  }

   async updateStock(id: string, stock: number, options?: IQueryOptions): Promise<InventoryReadModel> {
    const { entityManager } = this.parseOptions(options);
    const repo = entityManager.getRepository(InventoryEntity);
    await repo.update(id, { stock });
    const updated = await repo.findOne({ where: { id } });
    if (!updated) {
      throw new InternalServerErrorException(`Product ${id} not found after stock update`);
    }
    return InventoryReadModel.fromEntity(updated);
  }
}