import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddHiddenFieldToProducts1599506010712
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'hidden',
        type: 'boolean',
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('products', 'hidden');
  }
}
