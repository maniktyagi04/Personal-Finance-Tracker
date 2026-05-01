'use strict';

const budgetService = require('../services/budget.service');
const { sendSuccess } = require('../utils/apiResponse');

const upsertBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.upsertBudget(req.user.id, req.body);
    sendSuccess(res, budget, 'Budget set successfully.', 201);
  } catch (err) {
    next(err);
  }
};

const getBudgets = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const budgets = await budgetService.getBudgets(req.user.id, month, year);
    sendSuccess(res, budgets, 'Budgets retrieved successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = { upsertBudget, getBudgets };
