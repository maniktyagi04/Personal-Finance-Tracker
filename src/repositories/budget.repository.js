'use strict';

const prisma = require('../config/database');

const upsertBudget = async (userId, categoryId, month, year, amount) => {
  // Using findFirst + update/create because composite unique constraint is [userId, categoryId, month, year]
  // but Prisma upsert works best with @@unique fields. 
  // Let's use Prisma upsert since we have a composite unique.
  return prisma.budget.upsert({
    where: {
      userId_categoryId_month_year: {
        userId,
        categoryId,
        month,
        year
      }
    },
    update: { amount },
    create: {
      userId,
      categoryId,
      month,
      year,
      amount,
      spent: 0
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
  return prisma.budget.findMany({
    where: { userId, month, year },
    include: { category: true }
  });
};

module.exports = {
  upsertBudget,
  findBudget,
  updateBudgetSpent,
  findBudgetsByUser
};
