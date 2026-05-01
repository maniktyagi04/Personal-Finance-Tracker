'use strict';

require('dotenv').config();

const REQUIRED = ['DATABASE_URL', 'JWT_SECRET'];

REQUIRED.forEach((key) => {
  if (!process.env[key]) {
    console.error(`[ENV] Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,

  DATABASE_URL: process.env.DATABASE_URL,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12,

  isDev() {
    return this.NODE_ENV === 'development';
  },
  isProd() {
    return this.NODE_ENV === 'production';
  },
};

module.exports = env;
