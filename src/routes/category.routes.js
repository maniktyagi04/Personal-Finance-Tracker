'use strict';

const { Router } = require('express');
const categoryController = require('../controllers/category.controller');
const validate = require('../middlewares/validate.middleware');
const { protect } = require('../middlewares/auth.middleware');
const { createCategorySchema } = require('../validations/category.validation');

const router = Router();

router.use(protect); // All routes protected

router.post('/', validate(createCategorySchema), categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
