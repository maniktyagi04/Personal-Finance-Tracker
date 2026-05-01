'use strict';

const prisma = require('../config/database');

const createCategory = async (data) => {
  return prisma.category.create({ data });
};

const findCategoryById = async (id, userId) => {
  return prisma.category.findFirst({
    where: { id, userId },
  });
};

const findCategoriesByUser = async (userId) => {
  return prisma.category.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

const deleteCategory = async (id) => {
  return prisma.category.delete({
    where: { id },
  });
};

const findDefaultCategory = async (userId) => {
  return prisma.category.findFirst({
    where: { userId, isDefault: true },
  });
};

module.exports = {
  createCategory,
  findCategoryById,
  findCategoriesByUser,
  deleteCategory,
  findDefaultCategory
};
