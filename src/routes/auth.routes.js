/**
 * src/routes/auth.routes.js
 * Auth route definitions.
 * Each route applies:
 *   1. Zod validation middleware (validate)
 *   2. Optional JWT guard (protect)
 *   3. Controller handler
 */

'use strict';

const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { protect } = require('../middlewares/auth.middleware');
const { registerSchema, loginSchema } = require('../validations/auth.validation');

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

// Protected routes — require a valid JWT
router.get('/me', protect, authController.getMe);

module.exports = router;
