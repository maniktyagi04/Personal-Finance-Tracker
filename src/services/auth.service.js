'use strict';

const bcrypt = require('bcryptjs');
const env = require('../config/env');
const { signToken } = require('../utils/jwt');
const userRepository = require('../repositories/user.repository');

/**

 * @param {string} message
 * @param {number} statusCode
 */
const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};


/**

 * @param {{ name: string, email: string, password: string }} dto
 * @returns {Promise<{ user: object, token: string }>}
 */
const register = async ({ name, email, password }) => {

  const existing = await userRepository.findUserByEmail(email);
  if (existing) {
    throw createError('An account with this email already exists.', 409);
  }


  const passwordHash = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);

  const user = await userRepository.createUser({ name, email, passwordHash });


  const token = signToken({ id: user.id, email: user.email });

  return { user, token };
};


/**

 * @param {{ email: string, password: string }} dto
 * @returns {Promise<{ user: object, token: string }>}
 */
const login = async ({ email, password }) => {
  const userWithHash = await userRepository.findUserByEmail(email);


  const dummyHash = '$2a$12$dummyhashusedtopreventtimingattacksonnonexistentaccounts';
  const hashToCompare = userWithHash ? userWithHash.passwordHash : dummyHash;
  const passwordValid = await bcrypt.compare(password, hashToCompare);

  if (!userWithHash || !passwordValid) {
    throw createError('Invalid email or password.', 401);
  }

  const { passwordHash: _omit, ...user } = userWithHash;


  const token = signToken({ id: user.id, email: user.email });

  return { user, token };
};

module.exports = { register, login };
