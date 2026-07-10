import { InternalServerErrorException } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbDatabase = process.env.DB_DATABASE;

if (!dbHost || !dbPort || !dbUsername || !dbPassword || !dbDatabase) {
  throw new InternalServerErrorException(
    'Database configuration environment variables (DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE) are required.',
  );
}

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: dbHost,
  port: parseInt(dbPort, 10),
  username: dbUsername,
  password: dbPassword,
  database: dbDatabase,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/../database/migrations/*.{js,ts}'],
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
