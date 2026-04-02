import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class OrderMigrations1775130672172 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum type first — PostgreSQL requires this
    await queryRunner.query(
      `CREATE TYPE order_status_enum AS ENUM ('pending', 'processing', 'completed', 'cancelled')`,
    );
 
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            isGenerated: true,
            default: 'uuid_generate_v4()',
          },
          { name: 'title', type: 'varchar' },
          { name: 'description', type: 'varchar', isNullable: true },
          {
            name: 'status',
            type: 'order_status_enum',    // ← PostgreSQL uses custom enum type
            default: "'pending'",
          },
          { name: 'userId', type: 'varchar' },
          {
            name: 'createdAt',
            type: 'timestamp',            // ← PostgreSQL uses TIMESTAMP not DATETIME
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }
 
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('orders');
    await queryRunner.query(`DROP TYPE order_status_enum`);
  }
}