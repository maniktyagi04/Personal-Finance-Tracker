/**
 * src/middlewares/error.middleware.js
 * Global error-handling middleware.
 * Must be registered LAST in the Express middleware chain (4 args).
 *
 * Handles:
 *   - Prisma known errors (P2002 unique, P2025 not-found)
 *   - Generic application errors
 *   - Unknown / unhandled errors → 500
 */

'use strict';

const { Prisma } = require('@prisma/client');
const env = require('../config/env');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // ── Prisma-specific errors ────────────────────────────────────────────────
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

  // ── Operational errors set by our own code ────────────────────────────────
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  // Log in dev; in production use a real logger (e.g. Winston / Pino)
  if (env.isDev()) {
    console.error('[ErrorHandler]', err);
  } else {
    console.error(`[ErrorHandler] ${statusCode} - ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    // Only expose stack trace in development
    ...(env.isDev() && { stack: err.stack }),
  });
};

module.exports = errorHandler;
