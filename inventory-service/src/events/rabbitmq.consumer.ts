import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { InventoryRepository } from '../common/database/inventory/repositories/inventory.repository';



 
@Injectable()
export class RabbitMQConsumer implements OnModuleInit {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly logger = new Logger(RabbitMQConsumer.name);
 
  constructor(
    private readonly configService: ConfigService,
    private readonly inventoryRepository: InventoryRepository,
  ) {}
 
  // Called automatically when the module starts
  async onModuleInit() {
    await this.connect();
  }
 
  private async connect() {
    try {
      const url = this.configService.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672';
      const queue = this.configService.get<string>('RABBITMQ_QUEUE') || 'inventory_queue';
 
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();
 
      // Assert the same queue name as the publisher — must match exactly
      await this.channel.assertQueue(queue, { durable: true });
 
      // Process one message at a time
      this.channel.prefetch(1);
 
      this.logger.log(`Listening on queue: [${queue}]`);
 
      // Start consuming messages
      this.channel.consume(queue, async (msg) => {
        if (!msg) return;
 
        try {
          const content = JSON.parse(msg.content.toString());
          this.logger.log(`Event received: ${content.event}`);
 
          await this.handleEvent(content.event, content.data);
 
          // Acknowledge — tells RabbitMQ "I processed this successfully, remove it"
          this.channel.ack(msg);
        } catch (error) {
          const err = error as Error;
          this.logger.error('Failed to process message', err.message);
          // Negative acknowledge — puts the message back in the queue to retry
          this.channel.nack(msg, false, false);
        }
      });
    } catch (error) {
      const err = error as Error;
      this.logger.error('RabbitMQ consumer connection failed', err.message);
    }
  }
 
  private async handleEvent(event: string, data: any) {
    switch (event) {
      case 'order.created':
        await this.onOrderCreated(data);
        break;
      default:
        this.logger.warn(`Unknown event: ${event}`);
    }
  }
 
  // When an order is created, reduce stock by 1 for the first product in inventory
  // In a real system, the event payload would carry a productId + quantity
  private async onOrderCreated(data: { orderId: string; userId: string; title: string }) {
    this.logger.log(
      `🔔 Order created — orderId: ${data.orderId}, user: ${data.userId}`,
    );
 
    // Find all products and reduce stock of the first available one by 1
    // (simplified — in production the order payload would specify productId + qty)
    const products = await this.inventoryRepository.findAll();
    if (products.length > 0) {
      const product = products[0];
      const newStock = Math.max(0, product.stock - 1);
      await this.inventoryRepository.updateStock(product.id, newStock);
      this.logger.log(
        `📦 Stock updated — product: "${product.name}", stock: ${product.stock} → ${newStock}`,
      );
    } else {
      this.logger.warn('No products in inventory to update stock for');
    }
  }
}