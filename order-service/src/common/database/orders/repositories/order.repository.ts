import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { BaseRepository, IQueryOptions } from "../../database.repository";
import { OrderEntity } from "../entities/orders.entity";
import { DATABASE_CONNECTION } from "../../database.consts";
import { DataSource } from "typeorm";
import { OrderReadModel } from "../../../../order/models/order-read.model";
import { CreateOrderModel } from "../../../../order/models/create-order.model";

@Injectable()
export class OrderRepository extends BaseRepository {
    constructor(@Inject(DATABASE_CONNECTION) dataSource: DataSource ){
        super(dataSource);
    }

   
  async findAll(options?: IQueryOptions): Promise<OrderReadModel[]> {
    const { entityManager } = this.parseOptions(options);
    const repo = entityManager.getRepository(OrderEntity);
    const orders = await repo.find();
    return orders.map((o) => OrderReadModel.fromEntity(o));
  }

    async findById(id: string, options?: IQueryOptions): Promise<OrderReadModel | null> {
        const {entityManager} = this.parseOptions(options);
        const repo = entityManager.getRepository(OrderEntity);

        const order = await repo.findOne({where: {id}});
        return order ? OrderReadModel.fromEntity(order) : null;
    }

    async findByUserId(userId: string, options?: IQueryOptions): Promise<OrderReadModel[]> {
    const { entityManager } = this.parseOptions(options);
    const repo = entityManager.getRepository(OrderEntity);
    const orders = await repo.find({ where: { userId } });
    return orders.map((o) => OrderReadModel.fromEntity(o));
  }

  async create(model: CreateOrderModel, options?: IQueryOptions): Promise<OrderReadModel>{
    const { entityManager } = this.parseOptions(options);
    const repo = entityManager.getRepository(OrderEntity);
    try {
      const entity = new OrderEntity();
      entity.title = model.title;
      entity.description = model.description;
      entity.userId = model.userId;
      const saved = await repo.save(entity);
      return OrderReadModel.fromEntity(saved);
    } catch (error) {
      console.log('Error in OrderRepository.create:', error);
      throw new InternalServerErrorException('Failed to create order');
    }
  } 
}