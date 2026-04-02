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
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    DatabaseModule,
    // defaultStrategy tells PassportModule which strategy to use with @UseGuards(JwtAuthGuard)
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule needed so JwtStrategy can be initialized with the secret
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'secret',
      }),
      inject: [ConfigService],
    }),
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
 




