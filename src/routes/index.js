'use strict';

const { Router } = require('express');
const authRoutes = require('./auth.routes');

const router = Router();


router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Personal Finance Tracker API is running.',
    timestamp: new Date().toISOString(),
  });
});


const transactionRoutes = require('./transaction.routes');
const categoryRoutes = require('./category.routes');
const budgetRoutes = require('./budget.routes');
const reportRoutes = require('./report.routes');

router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);
router.use('/categories', categoryRoutes);
router.use('/budgets', budgetRoutes);
router.use('/reports', reportRoutes);

module.exports = router;
