'use strict';

const prisma = require('../config/database');

const getReportSummary = async (userId) => {
  const result = await prisma.transaction.groupBy({
    by: ['type'],
    where: { userId },
    _sum: {
      amount: true,
    },
  });

  let totalIncome = 0;
  let totalExpenses = 0;

  result.forEach(row => {
    if (row.type === 'INCOME') totalIncome += Number(row._sum.amount || 0);
    if (row.type === 'EXPENSE') totalExpenses += Number(row._sum.amount || 0);
  });

  return {
    totalIncome,
    totalExpenses,
    savings: totalIncome - totalExpenses
  };
};

const getCategoryBreakdown = async (userId) => {
  const result = await prisma.transaction.groupBy({
    by: ['categoryId', 'type'],
    where: { userId },
    _sum: {
      amount: true,
    },
  });

  // We need category names, so let's fetch them
  const categoryIds = [...new Set(result.map(r => r.categoryId))];
  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
    select: { id: true, name: true }
  });
  
  const categoryMap = {};
  categories.forEach(c => { categoryMap[c.id] = c.name; });

  const breakdown = result.map(row => ({
    categoryId: row.categoryId,
    categoryName: categoryMap[row.categoryId] || 'Unknown',
    type: row.type,
    amount: Number(row._sum.amount || 0)
  }));

  return breakdown;
};

module.exports = {
  getReportSummary,
  getCategoryBreakdown
};
