/**
 * src/controllers/auth.controller.js
 * HTTP layer for authentication.
 * Responsibilities:
 *   1. Extract validated data from req
 *   2. Delegate to the service
 *   3. Send the HTTP response
 *
 * NO business logic here — only request/response handling.
 */

'use strict';

const authService = require('../services/auth.service');
const { sendSuccess } = require('../utils/apiResponse');

// ── POST /api/v1/auth/register ────────────────────────────────────────────────

/**
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const { user, token } = await authService.register({ name, email, password });

    sendSuccess(
      res,
      { user, token },
      'Account created successfully.',
      201
    );
  } catch (err) {
    next(err);
  }
};

// ── POST /api/v1/auth/login ───────────────────────────────────────────────────

/**
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login({ email, password });

    sendSuccess(res, { user, token }, 'Logged in successfully.');
  } catch (err) {
    next(err);
  }
};

// ── GET /api/v1/auth/me ────────────────────────────────────────────────────────

/**
 * @route   GET /api/v1/auth/me
 * @access  Private (requires JWT)
 */
const getMe = async (req, res, next) => {
  try {
    // req.user is attached by the protect middleware
    sendSuccess(res, { user: req.user }, 'Profile retrieved successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe };
