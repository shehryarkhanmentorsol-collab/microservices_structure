import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class OrderServices1775036912256 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
            isGenerated: true,
          },
          { name: 'title', type: 'varchar' },
          { name: 'description', type: 'varchar', isNullable: true },
          {
            name: 'status',
            type: 'enum',
            enum: ['pending', 'processing', 'completed', 'cancelled'],
            default: "'pending'",
          },
          // userId is just a plain string — no FK because user lives in a different DB
          { name: 'userId', type: 'varchar' },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
  }
 
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('orders');
  }
}
 