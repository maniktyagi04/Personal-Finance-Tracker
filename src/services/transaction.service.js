'use strict';

const transactionRepo = require('../repositories/transaction.repository');
const categoryRepo = require('../repositories/category.repository');
const budgetRepo = require('../repositories/budget.repository');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const createTransaction = async (userId, data) => {
  // Check category
  const category = await categoryRepo.findCategoryById(data.categoryId, userId);
  if (!category) throw createError('Category not found', 404);

  const transaction = await transactionRepo.createTransaction({ ...data, userId });

  // Update budget if expense
  if (transaction.type === 'EXPENSE') {
    const d = new Date(transaction.date);
    await budgetRepo.updateBudgetSpent(userId, transaction.categoryId, d.getUTCMonth() + 1, d.getUTCFullYear(), Number(transaction.amount));
  }

  return transaction;
};

const updateTransaction = async (userId, transactionId, data) => {
  const existing = await transactionRepo.findTransactionById(transactionId, userId);
  if (!existing) throw createError('Transaction not found', 404);

  // If changing amount or category, we'd theoretically need to reverse old budget impact and apply new.
  // For simplicity, we just do the update. In a real app, calculate difference and update budget.
  if (existing.type === 'EXPENSE') {
      const oldD = new Date(existing.date);
      await budgetRepo.updateBudgetSpent(userId, existing.categoryId, oldD.getUTCMonth() + 1, oldD.getUTCFullYear(), -Number(existing.amount));
  }

  const transaction = await transactionRepo.updateTransaction(transactionId, data);

  if (transaction.type === 'EXPENSE') {
      const d = new Date(transaction.date);
      await budgetRepo.updateBudgetSpent(userId, transaction.categoryId, d.getUTCMonth() + 1, d.getUTCFullYear(), Number(transaction.amount));
  }

  return transaction;
};

const deleteTransaction = async (userId, transactionId) => {
  const existing = await transactionRepo.findTransactionById(transactionId, userId);
  if (!existing) throw createError('Transaction not found', 404);

  if (existing.type === 'EXPENSE') {
      const d = new Date(existing.date);
      await budgetRepo.updateBudgetSpent(userId, existing.categoryId, d.getUTCMonth() + 1, d.getUTCFullYear(), -Number(existing.amount));
  }

  await transactionRepo.deleteTransaction(transactionId);
  return { message: 'Transaction deleted successfully' };
};

const getTransactions = async (userId, query) => {
  return transactionRepo.findTransactions({ userId, ...query });
};

module.exports = {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactions
};
