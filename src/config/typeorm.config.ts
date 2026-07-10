import { InternalServerErrorException } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

import { ErrorMessages } from '../common/constants/error-messages.constant';

dotenv.config();

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbDatabase = process.env.DB_DATABASE;

if (!dbHost || !dbPort || !dbUsername || !dbPassword || !dbDatabase) {
  throw new InternalServerErrorException(ErrorMessages.DB_CONFIG_REQUIRED);
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
