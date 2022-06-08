import process from 'process';
import {IAppConfig} from '../index';
import dotenv from 'dotenv';
dotenv.config();

export const config: IAppConfig = {
  app: {
    secret: 'supersecretsalt',
    cookie: {
      name: 'apptilecookiee',
      maxAgeDuration: 1000 * 60 * 60 * 24,
      maxAgeLongDuration: 1000 * 60 * 60 * 24 * 30
    },
    site: {
      protocol: 'http',
      domainName: 'localhost:3000'
    },
    port: (process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : null) || 3000,
    debug: true
  },
  db: {
    main: {
      host: process.env.DB_HOST || 'postgres',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PWD || 'secretpassword',
      database: process.env.DB_NAME || 'postgres',
      charset: 'utf8'
    }
  }
};
