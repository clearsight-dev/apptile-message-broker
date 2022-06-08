import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
// import path from 'path';
import { AppConfig } from './config';
import database from './database';
import { dbInit } from './models';
import OrgRouter from './routes/OrgRouter';
import UsersRouter from './routes/UsersRouter';


const main = async () => {
  database.connect(AppConfig.db.main);
  dbInit();

  const app = express();

  app.use(morgan('combined', {stream: process.stdout}));
  app.use(cookieParser());

  app.use('/api/users', UsersRouter);
  app.use('/api/orgs', OrgRouter)

  
  app.listen(AppConfig.app.port, () => {
    // tslint:disable-next-line: no-console
    console.log(`Listening on port ${AppConfig.app.port}`);
  });
};

main().catch((err) => {
  // tslint:disable-next-line: no-console
  console.trace(err);
});
