/**
 * src/utils/jwt.js
 * Thin wrapper around the `jsonwebtoken` library.
 * Keeps JWT logic in one place so rotating the secret or
 * changing the algorithm only requires a change here.
 */

'use strict';

const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Sign a JWT containing the given payload.
 * @param {{ id: string, email: string }} payload
 * @returns {string} signed token
 */
const signToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
    algorithm: 'HS256',
  });
};

/**
 * Verify a JWT and return the decoded payload.
 * Throws `JsonWebTokenError` or `TokenExpiredError` on failure.
 * @param {string} token
 * @returns {object} decoded payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] });
};

module.exports = { signToken, verifyToken };
