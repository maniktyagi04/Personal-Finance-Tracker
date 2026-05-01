/**
 * src/routes/index.js
 * Central route registry.
 * All feature routers mount here under /api/v1.
 * Adding a new feature = one line in this file.
 */

'use strict';

const { Router } = require('express');
const authRoutes = require('./auth.routes');

const router = Router();

// Health check — does NOT require auth
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Personal Finance Tracker API is running.',
    timestamp: new Date().toISOString(),
  });
});

// Feature routers
router.use('/auth', authRoutes);

// Future feature routes — uncomment as implemented:
// router.use('/transactions', require('./transaction.routes'));
// router.use('/categories',   require('./category.routes'));
// router.use('/budgets',      require('./budget.routes'));
// router.use('/receipts',     require('./receipt.routes'));

module.exports = router;
