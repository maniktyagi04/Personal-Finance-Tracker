/**
 * src/utils/apiResponse.js
 * Standardised HTTP response helpers.
 * All responses follow the same envelope shape so the frontend
 * has a consistent contract regardless of endpoint.
 *
 * Success envelope:  { success: true,  data:    <payload>,  message: <string> }
 * Error envelope:    { success: false, error:   <message>,  details: <array | undefined> }
 */

'use strict';

/**
 * 200 OK / 201 Created
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
 * 4xx / 5xx error
 * @param {import('express').Response} res
 * @param {string} error
 * @param {number} [statusCode]
 * @param {Array} [details]  – Zod validation issues etc.
 */
const sendError = (res, error, statusCode = 500, details = undefined) => {
  const body = { success: false, error };
  if (details) body.details = details;
  res.status(statusCode).json(body);
};

module.exports = { sendSuccess, sendError };
