'use strict';

/**

 * @param {import('express').Response} res
 * @param {any} data
 * @param {string} [message]
 * @param {number} [statusCode]
 */
const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**

 * @param {import('express').Response} res
 * @param {string} error
 * @param {number} [statusCode]
 * @param {Array} [details]  
 */
const sendError = (res, error, statusCode = 500, details = undefined) => {
  const body = { success: false, error };
  if (details) body.details = details;
  res.status(statusCode).json(body);
};

module.exports = { sendSuccess, sendError };
