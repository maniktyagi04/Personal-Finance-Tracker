'use strict';

const transactionService = require('../services/transaction.service');
const { sendSuccess } = require('../utils/apiResponse');

const createTransaction = async (req, res, next) => {
  try {
    // If amount is a string, let's keep it string for Prisma Decimal, or convert to number depending on what Prisma expects. 
    // Prisma decimal accepts strings or numbers.
    const transaction = await transactionService.createTransaction(req.user.id, req.body);
    sendSuccess(res, transaction, 'Transaction created successfully.', 201);
  } catch (err) {
    next(err);
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.updateTransaction(req.user.id, req.params.id, req.body);
    sendSuccess(res, transaction, 'Transaction updated successfully.');
  } catch (err) {
    next(err);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const result = await transactionService.deleteTransaction(req.user.id, req.params.id);
    sendSuccess(res, result, 'Transaction deleted successfully.');
  } catch (err) {
    next(err);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const data = await transactionService.getTransactions(req.user.id, req.query);
    sendSuccess(res, data, 'Transactions retrieved successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = { createTransaction, updateTransaction, deleteTransaction, getTransactions };
