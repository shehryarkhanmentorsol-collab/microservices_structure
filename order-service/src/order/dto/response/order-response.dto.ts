import { OrderStatus } from "../../enums/order.enum";
import { OrderReadModel } from '../../models/order-read.model';

export class OrderResponseDto {
  static fromModel(model: OrderReadModel): OrderResponseDto {
    const dto = new OrderResponseDto();
    dto.id = model.id;
    dto.title = model.title;
    dto.description = model.description;
    dto.status = model.status;
    dto.userId = model.userId;
    dto.createdAt = model.createdAt;
    return dto;
  }

  id: string;
  title: string;
  description: string;
  status: OrderStatus;
  userId: string;
  createdAt: Date;
}