/**
 * src/config/database.js
 * Singleton Prisma client instance — Prisma 7 + @prisma/adapter-pg.
 *
 * Prisma 7 removed the built-in query engine and requires an explicit
 * driver adapter. We use `@prisma/adapter-pg` with a `pg.Pool` for
 * direct PostgreSQL connections.
 *
 * The pg.Pool is configured once and reused across requests, which
 * is critical for performance under load.
 *
 * In development, the instance is stored on globalThis so hot-reloads
 * (nodemon) don't open a new pool on every file change.
 */

'use strict';

require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const env = require('./env');

// ── Connection Pool ───────────────────────────────────────────────────────────
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  // Sensible defaults — tune for production workloads
  max: 10,            // max connections in pool
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

// ── Prisma Adapter + Client ───────────────────────────────────────────────────
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
