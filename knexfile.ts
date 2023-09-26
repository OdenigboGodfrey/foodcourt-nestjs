/* eslint-disable @typescript-eslint/no-var-requires */
import { Model } from 'objection';
import * as dotnev from 'dotenv';
import knex from 'knex';

dotnev.config();

const knexConfig = {
  client: 'pg',
  connection: {
    host: process.env.RDS_HOST,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_SID,
    port: process.env.RDS_PORT,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};

Model.knex(require('knex')(knexConfig));

export const knexInstance = knex(knexConfig);

export default knexConfig;
