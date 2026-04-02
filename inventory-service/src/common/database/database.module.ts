import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { DATABASE_CONNECTION } from './database.consts';
import { InventoryEntity } from './inventory/entities/inventory.entity';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: async (configService: ConfigService) => {
        const dataSource = new DataSource({
          type: 'mysql',
          host: configService.get('DB_HOST') || 'localhost',
          port: parseInt(configService.get('DB_PORT') || '3306', 10),
          username: configService.get('DB_USERNAME') || 'root',
          password: configService.get('DB_PASSWORD') ?? '',
          database: configService.get('DB_NAME') || 'inventory_db',
          entities: [InventoryEntity],
          synchronize: true,
        });
        return dataSource.initialize();
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}