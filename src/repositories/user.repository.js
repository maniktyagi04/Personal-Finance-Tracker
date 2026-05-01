'use strict';

const prisma = require('../config/database');

/**
 * Create a new user record.
 * @param {{ name: string, email: string, passwordHash: string }} data
 * @returns {Promise<User>}
 */
const createUser = async ({ name, email, passwordHash }) => {
  return prisma.user.create({
    data: { name, email, passwordHash },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
};

/**
 * @param {string} email
 * @returns {Promise<User | null>}
 */
const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      passwordHash: true,
      createdAt: true,
    },
  });
};

/**
 * Find a user by their primary key.
 * Never returns the password hash.
 * @param {string} id
 * @returns {Promise<User | null>}
 */
const findUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
