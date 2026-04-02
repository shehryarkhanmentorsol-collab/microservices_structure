import { DataSource } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

// This file is used by TypeORM CLI to run migrations.
// Run: npm run migration:run

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'users_db',
  entities: [join(__dirname, '/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '/db/migrations/*.ts')],
  synchronize: false,
});