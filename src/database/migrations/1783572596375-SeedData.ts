import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

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

    await queryRunner.query(`
            INSERT INTO "gifts" ("name", "description", "pointsRequired", "stock", "isAvailable")
            VALUES 
            ('Bình giữ nhiệt Lock&Lock', 'Dung tích 500ml, giữ nhiệt tốt, chất liệu thép không gỉ', 100, 50, true),
            ('Sách Đắc Nhân Tâm', 'Cuốn sách bán chạy nhất mọi thời đại về nghệ thuật ứng xử', 50, 30, true),
            ('Chuột không dây Logitech', 'Chuột Silent kết nối Bluetooth và Receiver 2.4G', 200, 20, true),
            ('Tai nghe Bluetooth Sony', 'Tai nghe chụp tai có chống ồn chủ động, pin 30h', 500, 10, true),
            ('Balo laptop chống nước', 'Chứa vừa laptop 15.6 inch, thiết kế công thái học', 150, 40, true);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "gifts";`);
    await queryRunner.query(
      `DELETE FROM "users" WHERE "email" IN ('admin@example.com', 'user@example.com');`,
    );
  }
}
