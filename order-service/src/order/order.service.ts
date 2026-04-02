import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { OrderRepository } from '../common/database/orders/repositories/order.repository';
import { OrderReadModel } from './models/order-read.model';
import { CreateOrderModel } from './models/create-order.model';
import { RabbitMQPublisher } from '../events/rabbitmq.publisher';
import { EVENTS, QUEUES } from '../events/events.constants';
import { isAxiosError } from 'axios';


// @Injectable()
// export class OrderService {
//   private readonly userServiceUrl: string;

//   constructor(
//     private readonly orderRepository: OrderRepository,
//     private readonly rabbitMQPublisher: RabbitMQPublisher,
//     private readonly configService: ConfigService,
//   ) {
//     this.userServiceUrl =
//       this.configService.get<string>('USER_SERVICE_URL') || 'http://localhost:3001/api';
//   }

//   async findAll(): Promise<OrderReadModel[]> {
//     try {
//       return await this.orderRepository.findAll();
//     } catch (error) {
//       throw new InternalServerErrorException('Failed to retrieve orders');
//     }
//   }

//   async findById(id: string): Promise<OrderReadModel> {
//     const order = await this.orderRepository.findById(id);
//     if (!order) throw new NotFoundException(`Order ${id} not found`);
//     return order;
//   }

//   async findMyOrders(userId: string): Promise<OrderReadModel[]> {
//     try {
//       return await this.orderRepository.findByUserId(userId);
//     } catch (error) {
//       throw new InternalServerErrorException('Failed to retrieve orders');
//     }
//   }

//   async create(model: CreateOrderModel): Promise<OrderReadModel> {
//     try {
//       // Step 1: Verify user exists via HTTP call to user-service
//       await this.verifyUserExists(model.userId);

//       // Step 2: Save the order
//       const order = await this.orderRepository.create(model);

//       // Step 3: Publish event to RabbitMQ → inventory-service consumes it
//       await this.rabbitMQPublisher.publish(QUEUES.INVENTORY, {
//         event: EVENTS.ORDER_CREATED,
//         data: {
//           orderId: order.id,
//           userId: order.userId,
//           title: order.title,
//         },
//       });

//       return order;
//     } catch (error) {
//       if (error instanceof NotFoundException) throw error;
//       throw new InternalServerErrorException('Failed to create order');
//     }
//   }

//   // HTTP call to user-service — synchronous communication
//   private async verifyUserExists(userId: string): Promise<void> {
//     try {
//       await axios.get(`${this.userServiceUrl}/users/${userId}`);
//     } catch (error) {
//       // isAxiosError narrows the type so TypeScript knows error.response exists
//       if (isAxiosError(error) && error.response?.status === 404) {
//         throw new NotFoundException(`User ${userId} not found`);
//       }
//       throw new InternalServerErrorException('User service unavailable');
//     }
//   }
// }


@Injectable()
export class OrderService {
  private readonly userServiceUrl: string;
 
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly rabbitMQPublisher: RabbitMQPublisher,
    private readonly configService: ConfigService,
  ) {
    this.userServiceUrl =
      this.configService.get<string>('USER_SERVICE_URL') || 'http://localhost:3001/api';
  }
 
  async findAll(): Promise<OrderReadModel[]> {
    try {
      return await this.orderRepository.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve orders');
    }
  }
 
  async findById(id: string): Promise<OrderReadModel> {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }
 
  async findMyOrders(userId: string): Promise<OrderReadModel[]> {
    try {
      return await this.orderRepository.findByUserId(userId);
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve orders');
    }
  }
 
  // Service receives Model — not DTO
  async create(model: CreateOrderModel): Promise<OrderReadModel> {
    try {
      // Step 1: Verify user exists via HTTP call to user-service
      await this.verifyUserExists(model.userId);
 
      // Step 2: Save the order
      const order = await this.orderRepository.create(model);
 
      // Step 3: Publish event to RabbitMQ → inventory-service consumes it
      await this.rabbitMQPublisher.publishOrderCreated({
        orderId: order.id,
        userId: order.userId,
        title: order.title,
      });
 
      return order;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to create order');
    }
  }
 
  // HTTP call to user-service — synchronous communication
  private async verifyUserExists(userId: string): Promise<void> {
    try {
      await axios.get(`${this.userServiceUrl}/users/${userId}`);
    } catch (error) {
      // isAxiosError narrows the type so TypeScript knows error.response exists
      if (isAxiosError(error) && error.response?.status === 404) {
        throw new NotFoundException(`User ${userId} not found`);
      }
      throw new InternalServerErrorException('User service unavailable');
    }
  }
}
 