import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAvatarToUsers1783572596376 implements MigrationInterface {
  name = 'AddAvatarToUsers1783572596376';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "avatar" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar"`);
  }
}
