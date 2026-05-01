/**
 * src/services/auth.service.js
 * Business logic for authentication.
 * Orchestrates the repository and utilities — never touches req/res.
 *
 * Rules:
 *  - All errors thrown here are plain Error objects with a `statusCode` property.
 *  - The error middleware converts them to HTTP responses.
 */

'use strict';

const bcrypt = require('bcryptjs');
const env = require('../config/env');
const { signToken } = require('../utils/jwt');
const userRepository = require('../repositories/user.repository');

/**
 * Create a new application error with an HTTP status code.
 * @param {string} message
 * @param {number} statusCode
 */
const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ── Register ──────────────────────────────────────────────────────────────────

/**
 * Register a new user.
 * @param {{ name: string, email: string, password: string }} dto
 * @returns {Promise<{ user: object, token: string }>}
 */
const register = async ({ name, email, password }) => {
  // 1. Guard: duplicate email
  const existing = await userRepository.findUserByEmail(email);
  if (existing) {
    throw createError('An account with this email already exists.', 409);
  }

  // 2. Hash password with configurable cost factor
  const passwordHash = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);

  // 3. Persist (repository layer returns safe user — no hash)
  const user = await userRepository.createUser({ name, email, passwordHash });

  // 4. Issue JWT
  const token = signToken({ id: user.id, email: user.email });

  return { user, token };
};

// ── Login ─────────────────────────────────────────────────────────────────────

/**
 * Authenticate a user and return a JWT.
 * @param {{ email: string, password: string }} dto
 * @returns {Promise<{ user: object, token: string }>}
 */
const login = async ({ email, password }) => {
  // 1. Look up user (includes passwordHash)
  const userWithHash = await userRepository.findUserByEmail(email);

  // 2. Use a constant-time comparison to avoid user enumeration
  //    bcrypt.compare returns false for non-existent users when given a dummy hash
  const dummyHash = '$2a$12$dummyhashusedtopreventtimingattacksonnonexistentaccounts';
  const hashToCompare = userWithHash ? userWithHash.passwordHash : dummyHash;
  const passwordValid = await bcrypt.compare(password, hashToCompare);

  if (!userWithHash || !passwordValid) {
    // Generic message — don't reveal which field is wrong
    throw createError('Invalid email or password.', 401);
  }

  // 3. Build safe user object (strip hash)
  const { passwordHash: _omit, ...user } = userWithHash;

  // 4. Issue JWT
  const token = signToken({ id: user.id, email: user.email });

  return { user, token };
};

module.exports = { register, login };
