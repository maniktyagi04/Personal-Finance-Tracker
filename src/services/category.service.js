'use strict';

const categoryRepo = require('../repositories/category.repository');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const createCategory = async (userId, data) => {
  return categoryRepo.createCategory({ ...data, userId });
};

const getCategories = async (userId) => {
  return categoryRepo.findCategoriesByUser(userId);
};

const deleteCategory = async (userId, categoryId) => {
  const category = await categoryRepo.findCategoryById(categoryId, userId);
  if (!category) throw createError('Category not found', 404);
  if (category.isDefault) throw createError('Cannot delete default category', 400);

  // Find or create default category
  let defaultCategory = await categoryRepo.findDefaultCategory(userId);
  if (!defaultCategory) {
    defaultCategory = await categoryRepo.createCategory({
      userId,
      name: 'Uncategorized',
      type: 'EXPENSE',
      isDefault: true
    });
  }

  // Use a transaction for atomicity
  const prisma = require('../config/database');
  await prisma.$transaction(async (tx) => {
    // 1. Reassign transactions
    await tx.transaction.updateMany({
      where: { userId, categoryId },
      data: { categoryId: defaultCategory.id },
    });

    // 2. Delete associated budgets
    await tx.budget.deleteMany({
      where: { userId, categoryId },
    });

    // 3. Delete category
    await tx.category.delete({
      where: { id: categoryId },
    });
  });

  return { message: 'Category deleted and transactions reassigned successfully' };
};

module.exports = {
  createCategory,
  getCategories,
  deleteCategory
};
