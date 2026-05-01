'use strict';

const { Router } = require('express');
const reportController = require('../controllers/report.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = Router();

router.use(protect);

router.get('/', reportController.getReport);

module.exports = router;
