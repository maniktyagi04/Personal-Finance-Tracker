'use strict';

const { Prisma } = require('@prisma/client');
const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': {
        const field = err.meta?.target?.[0] ?? 'field';
        return res.status(409).json({
          success: false,
          error: `A record with this ${field} already exists.`,
        });
      }
      case 'P2025':
        return res.status(404).json({
          success: false,
          error: 'Record not found.',
        });
      default:
        return res.status(400).json({
          success: false,
          error: 'Database operation failed.',
          ...(env.isDev() && { prismaCode: err.code }),
        });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      error: 'Invalid data provided to the database.',
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  if (env.isDev()) {
    console.error('[ErrorHandler]', err);
  } else {
    console.error(`[ErrorHandler] ${statusCode} - ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    error: message,

    ...(env.isDev() && { stack: err.stack }),
  });
};

module.exports = errorHandler;
