'use strict';

const { verifyToken } = require('../utils/jwt');
const { sendError } = require('../utils/apiResponse');


const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication required. Please log in.', 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return sendError(res, 'Malformed authorization header.', 401);
    }

    const decoded = verifyToken(token);
    req.user = decoded; 
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 'Your session has expired. Please log in again.', 401);
    }
    if (err.name === 'JsonWebTokenError') {
      return sendError(res, 'Invalid token. Please log in again.', 401);
    }
    next(err);
  }
};

module.exports = { protect };
