/**
 * src/middlewares/validate.middleware.js
 * Generic Zod validation middleware.
 * Validates req.body, req.params, and req.query against a Zod schema
 * that wraps them in a { body, params, query } object.
 *
 * Usage:
 *   router.post('/register', validate(registerSchema), authController.register);
 */

'use strict';

const { ZodError } = require('zod');
const { sendError } = require('../utils/apiResponse');

/**
 * @param {import('zod').ZodTypeAny} schema
 */
const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    // Attach cleaned / coerced data back to req safely
    if (parsed.body) req.body = parsed.body;
    if (parsed.params) req.params = parsed.params;
    if (parsed.query) {
      // Express 5 makes req.query a getter, so we modify the object in place
      for (const key of Object.keys(req.query)) delete req.query[key];
      Object.assign(req.query, parsed.query);
    }

    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const details = err.errors.map((e) => ({
        field: e.path.slice(1).join('.'), // strip leading 'body' / 'params'
        message: e.message,
      }));
      return sendError(res, 'Validation failed', 422, details);
    }
    next(err);
  }
};

module.exports = validate;
