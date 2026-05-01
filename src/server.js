'use strict';

const env = require('./config/env'); 
const app = require('./app');
const prisma = require('./config/database');

const startServer = async () => {
  try {

    await prisma.$connect();
    console.log('✅  Database connected successfully.');

    const server = app.listen(env.PORT, () => {
      console.log(`🚀  Server running on http://localhost:${env.PORT} [${env.NODE_ENV}]`);
      console.log(`📋  Health: http://localhost:${env.PORT}/api/v1/health`);
    });


    const shutdown = async (signal) => {
      console.log(`\n⚠️  Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('✅  HTTP server closed. Database disconnected.');
        process.exit(0);
      });


      setTimeout(() => {
        console.error('❌  Graceful shutdown timed out. Force exiting.');
        process.exit(1);
      }, 10_000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    console.error('❌  Failed to start server:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();
