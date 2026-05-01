'use strict';

const { z } = require('zod');

const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(100),
    type: z.enum(['INCOME', 'EXPENSE']),
    icon: z.string().optional(),
    color: z.string().optional(),
  }),
});

module.exports = { createCategorySchema };
