'use strict';

const { z } = require('zod');

const upsertBudgetSchema = z.object({
  body: z.object({
    categoryId: z.string().uuid('Invalid category ID'),
    month: z.number().min(1).max(12),
    year: z.number().min(2000).max(2100),
    amount: z.number().or(z.string().regex(/^\d+(\.\d{1,2})?$/)),
  }),
});

const getBudgetsSchema = z.object({
  query: z.object({
    month: z.string().regex(/^\d+$/).transform(Number),
    year: z.string().regex(/^\d+$/).transform(Number),
  }),
});

module.exports = { upsertBudgetSchema, getBudgetsSchema };
