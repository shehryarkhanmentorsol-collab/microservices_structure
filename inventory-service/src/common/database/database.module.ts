import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Inventory, InventorySchema } from './inventory/schema/inventory.schema';


@Module({
  imports: [
    // Step 1 — connect to MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/inventory_db',
      }),
      inject: [ConfigService],
    }),
    // Step 2 — register the schema so it can be injected in repository
    MongooseModule.forFeature([
      { name: Inventory.name, schema: InventorySchema },
    ]),
  ],
  exports: [
    MongooseModule, // export so repository can use @InjectModel()
  ],
})
export class DatabaseModule {}