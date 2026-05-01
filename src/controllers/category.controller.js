'use strict';

const categoryService = require('../services/category.service');
const { sendSuccess } = require('../utils/apiResponse');

const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.user.id, req.body);
    sendSuccess(res, category, 'Category created successfully.', 201);
  } catch (err) {
    next(err);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories(req.user.id);
    sendSuccess(res, categories, 'Categories retrieved successfully.');
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const result = await categoryService.deleteCategory(req.user.id, req.params.id);
    sendSuccess(res, result, 'Category deleted successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = { createCategory, getCategories, deleteCategory };
