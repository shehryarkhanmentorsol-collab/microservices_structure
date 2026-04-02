import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { DatabaseModule } from '../common/database/database.module';
import { InventoryRepository } from '../common/database/inventory/repositories/inventory.repository';
import { RabbitMQConsumer } from '../events/rabbitmq.consumer';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { InventoryEventController } from '../events/inventory-event.controller';

@Module({
  imports: [DatabaseModule, PassportModule],
  controllers: [
    InventoryController,       // handles HTTP requests
    InventoryEventController,  // handles RabbitMQ events
  ],
  providers: [
    InventoryService,
    InventoryRepository,
    JwtStrategy,
    // RabbitMQConsumer removed — NestJS microservice transport handles this now
  ],
})
export class InventoryModule {}