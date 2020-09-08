import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddAddressToOrder1599516839789
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('orders', [
      new TableColumn({
        name: 'zip_code',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'city',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'address',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('orders', 'address');
    await queryRunner.dropColumn('orders', 'city');
    await queryRunner.dropColumn('orders', 'zip_code');
  }
}
