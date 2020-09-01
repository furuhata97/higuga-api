import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddSalesField1597009586823 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('sales', [
      new TableColumn({
        name: 'money_received',
        type: 'numeric',
        precision: 10,
        scale: 2,
        default: 0,
      }),
      new TableColumn({
        name: 'change',
        type: 'numeric',
        precision: 10,
        scale: 2,
        default: 0,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('sales', 'change');
    await queryRunner.dropColumn('sales', 'money_received');
  }
}
