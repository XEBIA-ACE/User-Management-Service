'use strict';

const IOtpService = require('../../../domain/ports/IOtpService');
const logger = require('../../logger');

/**
 * Simple in-process OTP service.
 * In production, replace send() with an email/SMS provider integration.
 */
class SimpleOtpService extends IOtpService {
  /**
   * @param {number} [length=6]
   * @returns {string}
   */
  generate(length = 6) {
    const max = Math.pow(10, length);
    const min = Math.pow(10, length - 1);
    return String(Math.floor(Math.random() * (max - min)) + min);
  }

  /**
   * @param {string} destination
   * @param {string} otp
   * @returns {Promise<void>}
   */
  async send(destination, otp) {
    // TODO: integrate with an email/SMS provider (e.g. SendGrid, Twilio)
    logger.info(`[OTP] Sending OTP ${otp} to ${destination}`);
  }
}

module.exports = SimpleOtpService;
