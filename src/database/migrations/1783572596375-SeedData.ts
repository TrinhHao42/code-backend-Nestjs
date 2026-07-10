import * as bcrypt from 'bcrypt';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedData1783572596375 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Admin123@', salt);
    const userPassword = await bcrypt.hash('User123@', salt);

    // Insert Admin (Nếu chưa tồn tại)
    const adminExists = (await queryRunner.query(
      `SELECT id FROM "users" WHERE "email" = 'admin@example.com' LIMIT 1;`,
    )) as unknown[];
    if (adminExists.length === 0) {
      await queryRunner.query(`
                INSERT INTO "users" ("email", "password", "fullName", "role")
                VALUES ('admin@example.com', '${adminPassword}', 'System Administrator', 'admin');
            `);
    }

    // Insert User (Nếu chưa tồn tại)
    const userExists = (await queryRunner.query(
      `SELECT id FROM "users" WHERE "email" = 'user@example.com' LIMIT 1;`,
    )) as unknown[];
    if (userExists.length === 0) {
      await queryRunner.query(`
                INSERT INTO "users" ("email", "password", "fullName", "role")
                VALUES ('user@example.com', '${userPassword}', 'Regular User', 'user');
            `);
    }

    const gifts = [
      {
        name: 'Bình giữ nhiệt Lock&Lock',
        description: 'Dung tích 500ml, giữ nhiệt tốt, chất liệu thép không gỉ',
        pointsRequired: 100,
        stock: 50,
        isAvailable: true,
      },
      {
        name: 'Sách Đắc Nhân Tâm',
        description: 'Cuốn sách bán chạy nhất mọi thời đại về nghệ thuật ứng xử',
        pointsRequired: 50,
        stock: 30,
        isAvailable: true,
      },
      {
        name: 'Chuột không dây Logitech',
        description: 'Chuột Silent kết nối Bluetooth và Receiver 2.4G',
        pointsRequired: 200,
        stock: 20,
        isAvailable: true,
      },
      {
        name: 'Tai nghe Bluetooth Sony',
        description: 'Tai nghe chụp tai có chống ồn chủ động, pin 30h',
        pointsRequired: 500,
        stock: 10,
        isAvailable: true,
      },
      {
        name: 'Balo laptop chống nước',
        description: 'Chứa vừa laptop 15.6 inch, thiết kế công thái học',
        pointsRequired: 150,
        stock: 40,
        isAvailable: true,
      },
    ];

    for (const gift of gifts) {
      const exists = (await queryRunner.query(`SELECT id FROM "gifts" WHERE "name" = $1 LIMIT 1;`, [
        gift.name,
      ])) as unknown[];
      if (exists.length === 0) {
        await queryRunner.query(
          `INSERT INTO "gifts" ("name", "description", "pointsRequired", "stock", "isAvailable") VALUES ($1, $2, $3, $4, $5);`,
          [gift.name, gift.description, gift.pointsRequired, gift.stock, gift.isAvailable],
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "gifts";`);
    await queryRunner.query(
      `DELETE FROM "users" WHERE "email" IN ('admin@example.com', 'user@example.com');`,
    );
  }
}
