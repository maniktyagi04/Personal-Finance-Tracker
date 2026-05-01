'use strict';

const { Router } = require('express');
const budgetController = require('../controllers/budget.controller');
const validate = require('../middlewares/validate.middleware');
const { protect } = require('../middlewares/auth.middleware');
const { upsertBudgetSchema, getBudgetsSchema } = require('../validations/budget.validation');

const router = Router();

router.use(protect);

router.post('/', validate(upsertBudgetSchema), budgetController.upsertBudget);
router.get('/', validate(getBudgetsSchema), budgetController.getBudgets);

module.exports = router;
