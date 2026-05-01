'use strict';

const { z } = require('zod');

const createTransactionSchema = z.object({
  body: z.object({
    amount: z.number().or(z.string().regex(/^-?\d+(\.\d{1,2})?$/)), // allow negative
    type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
    categoryId: z.string().uuid('Invalid category ID'),
    currency: z.string().min(3).max(3).optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').or(z.date()),
    description: z.string().optional(),
  }),
});

const updateTransactionSchema = z.object({
  body: z.object({
    amount: z.number().or(z.string().regex(/^-?\d+(\.\d{1,2})?$/)).optional(),
    type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']).optional(),
    categoryId: z.string().uuid('Invalid category ID').optional(),
    currency: z.string().min(3).max(3).optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').or(z.date()).optional(),
    description: z.string().optional(),
  }),
});

const getTransactionsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    categoryId: z.string().uuid().optional(),
    type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']).optional(),
  }),
});

module.exports = { createTransactionSchema, updateTransactionSchema, getTransactionsSchema };
