import { Injectable, OnModuleInit, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { EVENTS } from './events.constants';
import { ClientProxy } from '@nestjs/microservices';

// @Injectable()
// export class RabbitMQPublisher implements OnModuleInit {
//   private connection: amqp.Connection;
//   private channel: amqp.Channel;
//   private readonly logger = new Logger(RabbitMQPublisher.name);
 
//   constructor(private readonly configService: ConfigService) {}
 
//   // Called automatically when the module starts up
//   async onModuleInit() {
//     await this.connect();
//   }
 
//   private async connect() {
//     try {
//       const url = this.configService.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672';
//       this.connection = await amqp.connect(url);
//       this.channel = await this.connection.createChannel();
 
//       // Assert the queue — creates it if it doesn't exist yet
//       const queue = this.configService.get<string>('RABBITMQ_QUEUE') || 'inventory_queue';
//       await this.channel.assertQueue(queue, { durable: true });
 
//       this.logger.log(`RabbitMQ connected — queue: ${queue}`);
//     } catch (error) {
//       const err = error as Error;
//       this.logger.error('RabbitMQ connection failed', err.message);
//     }
//   }
 
//   // Publish an event to the queue
//   async publish(queue: string, event: object): Promise<void> {
//     try {
//       const message = JSON.stringify(event);
//       this.channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
//       this.logger.log(`Event published to [${queue}]: ${message}`);
//     } catch (error) {
//       const err = error as Error;
//       this.logger.error('Failed to publish event', err.message);
//     }
//   }
// }

 
// ─────────────────────────────────────────────────────────────────────────────
// WHY WE REPLACED amqplib WITH ClientProxy
//
// Before: manually connected to RabbitMQ using raw amqplib
//         and called channel.sendToQueue() ourselves.
//
// Now: NestJS manages the connection via ClientProxy.
//      We just call this.client.emit() — NestJS handles the rest.
//
// INVENTORY_SERVICE is the injection token registered in OrderModule.
// ClientProxy is pre-configured with RMQ transport + queue in order.module.ts
// ─────────────────────────────────────────────────────────────────────────────
 
export const INVENTORY_SERVICE = 'INVENTORY_SERVICE';
 
@Injectable()
export class RabbitMQPublisher {
  private readonly logger = new Logger(RabbitMQPublisher.name);
 
  constructor(
    @Inject(INVENTORY_SERVICE) private readonly client: ClientProxy,
  ) {}
 
  // emit() is fire-and-forget — matches @EventPattern() on the consumer side
  async publishOrderCreated(data: {
    orderId: string;
    userId: string;
    title: string;
  }): Promise<void> {
    try {
      this.client.emit(EVENTS.ORDER_CREATED, data);
      this.logger.log(
        `📤 Event emitted: ${EVENTS.ORDER_CREATED} — orderId: ${data.orderId}`,
      );
    } catch (error) {
      const err = error as Error;
      this.logger.error('Failed to publish event', err.message);
    }
  }
}
 