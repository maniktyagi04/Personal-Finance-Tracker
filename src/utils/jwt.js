'use strict';

const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * @param {{ id: string, email: string }} payload
 * @returns {string} 
 */
const signToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
    algorithm: 'HS256',
  });
};

/**
 * @param {string} token
 * @returns {object} 
 */
const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] });
};

module.exports = { signToken, verifyToken };
