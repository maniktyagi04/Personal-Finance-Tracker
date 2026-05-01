'use strict';

const authService = require('../services/auth.service');
const { sendSuccess } = require('../utils/apiResponse');


/**
 * @route   
 * @access  
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


/**
 * @route   
 * @access  
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


/**
 * @route   
 * @access  
 */
const getMe = async (req, res, next) => {
  try {
    
    sendSuccess(res, { user: req.user }, 'Profile retrieved successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe };
