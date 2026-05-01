'use strict';

const reportRepo = require('../repositories/report.repository');

const getReport = async (userId) => {
  const summary = await reportRepo.getReportSummary(userId);
  const categoryBreakdown = await reportRepo.getCategoryBreakdown(userId);

  return {
    ...summary,
    categoryBreakdown
  };
};

module.exports = {
  getReport
};
