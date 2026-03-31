import { BadGatewayException, BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OrderReadModel } from "./models/order-read.model";
import { CreateOrderModel } from "./models/create-order.model";
import axios from "axios";
import axios from "axios";

@Injectable()
export class OrderService {
    private readonly userServiceUrl: string;

    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly rabbitMQService: RabbitMQService,
        private readonly configService: ConfigService,
    ) {
        this.userServiceUrl = this.configService.get<string>('USER_SERVICE_URL') || 'http://localhost:3001/api'
    }

    async findAll(): Promise<OrderReadModel[]> {
        try {
            return await this.orderRepository.findAll()
        } catch (error) {
            throw new BadRequestException('Failed to fetch orders');
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

    async create(model: CreateOrderModel): Promise<OrderReadModel> {
        try {
            // validate user existence via User Service
            await this.verifyUserExists(model.userId);

            // create order
            const order = await this.orderRepository.create(model);

            // publish event to RabbitMQ
            
            await this.rabbitMQService.publish(QUEUE.INVENTORY,{
                events: EVENTS.ORDER_CREATED,
                data: {
                    orderId: order.id,
                    userId: order.userId,
                    title: order.title,
                },
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
      if (error.response?.status === 404) {
        throw new NotFoundException(`User ${userId} not found`);
      }
      throw new InternalServerErrorException('User service unavailable');
    }
  }
 
}