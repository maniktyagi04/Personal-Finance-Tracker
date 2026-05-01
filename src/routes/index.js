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

router.use('/auth', authRoutes);

module.exports = router;
