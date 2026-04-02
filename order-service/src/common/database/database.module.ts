import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { DATABASE_CONNECTION } from './database.consts';
import { OrderEntity } from './orders/entities/orders.entity';

// export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: async (configService: ConfigService) => {
        const dataSource = new DataSource({
          type: 'postgres',
          host: configService.get('DB_HOST') || 'localhost',
          port: parseInt(configService.get('DB_PORT') || '5432', 10),
          username: configService.get('DB_USERNAME') || 'postgres',
          password: String(configService.get('DB_PASSWORD') || ''),
          database: configService.get('DB_NAME') || 'orders_db',
          entities: [OrderEntity],
          synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
        });
        return dataSource.initialize();
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}