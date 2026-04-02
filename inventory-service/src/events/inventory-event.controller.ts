import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { InventoryRepository } from '../common/database/inventory/repositories/inventory.repository';


@Controller()
export class InventoryEventController {
  private readonly logger = new Logger(InventoryEventController.name);

  constructor(private readonly inventoryRepository: InventoryRepository) {}

  @EventPattern('order.created')
  async handleOrderCreated(
    @Payload() data: { orderId: string; userId: string; title: string },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      this.logger.log(
        `📨 Event received: order.created — orderId: ${data.orderId}, user: ${data.userId}`,
      );

      // Find all products and reduce stock of the first available one by 1
      // In production the payload would carry productId + quantity
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

      // Manually acknowledge — tells RabbitMQ "processed successfully, remove from queue"
      channel.ack(originalMessage);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to process order.created event: ${err.message}`);
      // Negative acknowledge — puts message back in queue to retry
      channel.nack(originalMessage, false, false);
    }
  }
}