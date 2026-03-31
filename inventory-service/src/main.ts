import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3003);

    console.log("inventory-service is running on port " + (process.env.PORT ?? 3003));

}
bootstrap();
