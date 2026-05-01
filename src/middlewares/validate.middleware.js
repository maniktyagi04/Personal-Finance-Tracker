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

    if (parsed.body) req.body = parsed.body;
    if (parsed.params) req.params = parsed.params;
    if (parsed.query) {
      for (const key of Object.keys(req.query)) delete req.query[key];
      Object.assign(req.query, parsed.query);
    }

    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const details = err.errors.map((e) => ({
        field: e.path.slice(1).join('.'), 
        message: e.message,
      }));
      return sendError(res, 'Validation failed', 422, details);
    }
    next(err);
  }
};

module.exports = validate;
