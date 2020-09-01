import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class RemoveAddressFromUser1597535061383
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'zip_code');
    await queryRunner.dropColumn('users', 'city');
    await queryRunner.dropColumn('users', 'address');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'address',
        type: 'varchar',
      }),
      new TableColumn({
        name: 'city',
        type: 'varchar',
      }),
      new TableColumn({
        name: 'zip_code',
        type: 'varchar',
      }),
    ]);
  }
}
