require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PWD || 'secretpassword',
    database: process.env.DB_NAME || 'postgres',
    host: process.env.DB_HOST || 'postgres',
    port: '5432',
    dialect: 'postgres',
    dialectOptions: {
      supportBigNumbers: true
    }
  },
  staging: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PWD || 'secretpassword',
    database: process.env.DB_NAME || 'postgres',
    host: process.env.DB_HOST || 'postgres',
    port: '5432',
    dialect: 'postgres',
    dialectOptions: {
      supportBigNumbers: true
    }
  },
  production: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PWD || 'secretpassword',
    database: process.env.DB_NAME || 'postgres',
    host: process.env.DB_HOST || 'postgres',
    port: '5432',
    dialect: 'postgres',
    dialectOptions: {
      supportBigNumbers: true
    }
  }
};
