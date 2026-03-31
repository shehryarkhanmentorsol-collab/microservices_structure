import { OrderStatus } from '../enums/order.enum';
import { OrderEntity } from '../../common/database/orders/entities/orders.entity';

export class OrderReadModel {
  static fromEntity(entity: OrderEntity): OrderReadModel {
    const model = new OrderReadModel();
    model.id = entity.id;
    model.title = entity.title;
    model.description = entity.description;
    model.status = entity.status;
    model.userId = entity.userId;
    model.createdAt = entity.createdAt;
    return model;
  }

  id: string;
  title: string;
  description: string;
  status: OrderStatus;
  userId: string;
  createdAt: Date;
}