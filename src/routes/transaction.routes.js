'use strict';

const { Router } = require('express');
const transactionController = require('../controllers/transaction.controller');
const validate = require('../middlewares/validate.middleware');
const { protect } = require('../middlewares/auth.middleware');
const { createTransactionSchema, updateTransactionSchema, getTransactionsSchema } = require('../validations/transaction.validation');

const router = Router();

router.use(protect);

router.post('/', validate(createTransactionSchema), transactionController.createTransaction);
router.put('/:id', validate(updateTransactionSchema), transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);
router.get('/', validate(getTransactionsSchema), transactionController.getTransactions);

module.exports = router;
