'use strict';

const logger = require('../../logger');

/**
 * Central error-handling middleware.
 *
 * @param {Error}                          err
 * @param {import('express').Request}      req
 * @param {import('express').Response}     res
 * @param {import('express').NextFunction} _next
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = statusCode < 500 ? err.message : 'Internal Server Error';

  if (statusCode >= 500) {
    logger.error(err);
  }

  res.status(statusCode).json({ success: false, message });
}

module.exports = errorHandler;
