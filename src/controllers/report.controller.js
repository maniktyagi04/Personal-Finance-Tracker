'use strict';

const reportService = require('../services/report.service');
const { sendSuccess } = require('../utils/apiResponse');

const getReport = async (req, res, next) => {
  try {
    const report = await reportService.getReport(req.user.id);
    sendSuccess(res, report, 'Report retrieved successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = { getReport };
