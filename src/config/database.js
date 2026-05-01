'use strict';

require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const env = require('./env');


const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,            
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});


const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg(pool),
    log: env.isDev() ? ['query', 'warn', 'error'] : ['warn', 'error'],
  });

if (env.isDev()) {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
