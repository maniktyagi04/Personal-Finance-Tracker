'use strict';

const prisma = require('../config/database');

const upsertBudget = async (userId, categoryId, month, year, amount) => {
  // Check if we already have a budget
  const existing = await prisma.budget.findUnique({
    where: { userId_categoryId_month_year: { userId, categoryId, month, year } }
  });

  if (existing) {
    return prisma.budget.update({
      where: { id: existing.id },
      data: { amount }
    });
  }

  // If creating new budget, calculate past spent amount for this month
  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  const aggregation = await prisma.transaction.aggregate({
    where: {
      userId,
      categoryId,
      type: 'EXPENSE',
      date: { gte: startDate, lte: endDate }
    },
    _sum: { amount: true }
  });

  const spent = Number(aggregation._sum.amount || 0);

  return prisma.budget.create({
    data: {
      userId,
      categoryId,
      month,
      year,
      amount,
      spent
    }
  });
};

const findBudget = async (userId, categoryId, month, year) => {
  return prisma.budget.findUnique({
    where: {
      userId_categoryId_month_year: {
        userId,
        categoryId,
        month,
        year
      }
    }
  });
};

const updateBudgetSpent = async (userId, categoryId, month, year, spentAdjustment) => {
  const budget = await findBudget(userId, categoryId, month, year);
  if (!budget) return null;
  return prisma.budget.update({
    where: { id: budget.id },
    data: {
      spent: { increment: spentAdjustment }
    }
  });
};

const findBudgetsByUser = async (userId, month, year) => {
  const where = { userId };
  if (month) where.month = month;
  if (year) where.year = year;
  
  return prisma.budget.findMany({
    where,
    include: { category: true }
  });
};

const deleteBudgetsByCategory = async (userId, categoryId) => {
  return prisma.budget.deleteMany({
    where: { userId, categoryId }
  });
};

module.exports = {
  upsertBudget,
  findBudget,
  updateBudgetSpent,
  findBudgetsByUser,
  deleteBudgetsByCategory
};
