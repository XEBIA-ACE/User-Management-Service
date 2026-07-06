'use strict';

/**
 * Minimal structured logger.
 * Swap for winston / pino in production.
 */
const logger = {
  info: (...args) => console.log('[INFO]', ...args),
  warn: (...args) => console.warn('[WARN]', ...args),
  error: (...args) => console.error('[ERROR]', ...args),
  debug: (...args) => {
    if (process.env.LOG_LEVEL === 'debug') console.debug('[DEBUG]', ...args);
  },
};

module.exports = logger;
