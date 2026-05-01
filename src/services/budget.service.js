'use strict';

const budgetRepo = require('../repositories/budget.repository');
const categoryRepo = require('../repositories/category.repository');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const upsertBudget = async (userId, { categoryId, month, year, amount }) => {
  const category = await categoryRepo.findCategoryById(categoryId, userId);
  if (!category) throw createError('Category not found', 404);

  return budgetRepo.upsertBudget(userId, categoryId, month, year, amount);
};

const getBudgets = async (userId, month, year) => {
  const m = month ? parseInt(month, 10) : undefined;
  const y = year ? parseInt(year, 10) : undefined;
  const budgets = await budgetRepo.findBudgetsByUser(userId, m, y);
  return budgets.map(b => ({
    ...b,
    isOverspent: Number(b.spent) > Number(b.amount)
  }));
};

module.exports = {
  upsertBudget,
  getBudgets
};
