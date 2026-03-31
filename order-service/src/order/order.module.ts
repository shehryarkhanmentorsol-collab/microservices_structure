import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { OrderService } from './order.service';
import { OrderControlller } from './order.controller';
import { DatabaseModule } from '../common/database/database.module';
import { OrderRepository } from 'src/common/database/repositories/order.repository';
import { RabbitMQPublisher } from 'src/events/rabbitmq.publisher';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  imports: [DatabaseModule, PassportModule],
  controllers: [OrderControlller],
  providers: [OrderService, OrderRepository, RabbitMQPublisher, JwtStrategy],
})
export class OrderModule {}