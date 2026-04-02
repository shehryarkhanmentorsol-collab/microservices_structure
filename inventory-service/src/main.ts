import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  // Step 1 — create the main HTTP application
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  // Step 2 — connect RabbitMQ microservice transport to the SAME app
  // This makes it a HYBRID app — handles both HTTP requests AND RabbitMQ events
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: process.env.RABBITMQ_QUEUE || 'inventory_queue',
      queueOptions: {
        durable: true,
      },
      // noAck: false means we manually acknowledge messages (safer)
      noAck: false,
    },
  });

  // Step 3 — start BOTH the microservice listener AND the HTTP server
  await app.startAllMicroservices();

  const port = process.env.PORT || 3003;
  await app.listen(port);

  console.log(`🏭 Inventory Service HTTP running on http://localhost:${port}/api`);
  console.log(`📥 Inventory Service RabbitMQ listening on queue: inventory_queue`);
}
bootstrap();