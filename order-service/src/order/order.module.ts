import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { OrderService } from './order.service';
import { DatabaseModule } from '../common/database/database.module';
import { OrderRepository } from '../common/database/orders/repositories/order.repository';
import { INVENTORY_SERVICE, RabbitMQPublisher } from '../events/rabbitmq.publisher';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { OrderController } from './order.controller';
import { ClientsModule } from '@nestjs/microservices/module/clients.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    // Register the RabbitMQ client — this creates the ClientProxy
    // injected into RabbitMQPublisher as INVENTORY_SERVICE token
    ClientsModule.registerAsync([
      {
        name: INVENTORY_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672'],
            queue: configService.get<string>('RABBITMQ_QUEUE') || 'inventory_queue',
            queueOptions: { durable: true },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, RabbitMQPublisher, JwtStrategy],
})
export class OrderModule {}
 