'use strict';

const prisma = require('../config/database');

const createTransaction = async (data) => {
  return prisma.transaction.create({ data });
};

const updateTransaction = async (id, data) => {
  return prisma.transaction.update({
    where: { id },
    data,
  });
};

const deleteTransaction = async (id) => {
  return prisma.transaction.delete({
    where: { id },
  });
};

const findTransactionById = async (id, userId) => {
  return prisma.transaction.findFirst({
    where: { id, userId },
  });
};

const findTransactions = async ({ userId, page = 1, limit = 10, startDate, endDate, categoryId, type }) => {
  const where = { userId };
  if (startDate && endDate) {
    where.date = { gte: new Date(startDate), lte: new Date(endDate) };
  } else if (startDate) {
    where.date = { gte: new Date(startDate) };
  } else if (endDate) {
    where.date = { lte: new Date(endDate) };
  }
  
  if (categoryId) where.categoryId = categoryId;
  if (type) where.type = type;

  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      skip,
      take: limit,
      orderBy: { date: 'desc' },
      include: { category: true },
    }),
    prisma.transaction.count({ where }),
  ]);

  return { transactions, total, pages: Math.ceil(total / limit) };
};

const reassignTransactionsCategory = async (userId, oldCategoryId, newCategoryId) => {
  return prisma.transaction.updateMany({
    where: { userId, categoryId: oldCategoryId },
    data: { categoryId: newCategoryId },
  });
};

module.exports = {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  findTransactionById,
  findTransactions,
  reassignTransactionsCategory
};
