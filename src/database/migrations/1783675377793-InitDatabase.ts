import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1783675377793 implements MigrationInterface {
  name = 'InitDatabase1783675377793';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "gifts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "pointsRequired" integer NOT NULL DEFAULT '0', "stock" integer NOT NULL DEFAULT '0', "isAvailable" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_54242922934e1f322861d116af7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'admin')`);
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "fullName" character varying NOT NULL DEFAULT '', "avatar" character varying, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "points" integer NOT NULL DEFAULT '1000', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."redemptions_status_enum" AS ENUM('pending', 'completed', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "redemptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "giftId" uuid, "pointsUsed" integer NOT NULL, "status" "public"."redemptions_status_enum" NOT NULL DEFAULT 'completed', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_def143ab94376fea5985bb04219" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "redemptions" ADD CONSTRAINT "FK_e660c1ae04d4672daa22dc10c14" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "redemptions" ADD CONSTRAINT "FK_5b13a2703191a80e2cd2bb23640" FOREIGN KEY ("giftId") REFERENCES "gifts"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "redemptions" DROP CONSTRAINT "FK_5b13a2703191a80e2cd2bb23640"`,
    );
    await queryRunner.query(
      `ALTER TABLE "redemptions" DROP CONSTRAINT "FK_e660c1ae04d4672daa22dc10c14"`,
    );
    await queryRunner.query(`DROP TABLE "redemptions"`);
    await queryRunner.query(`DROP TYPE "public"."redemptions_status_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TABLE "gifts"`);
  }
}
