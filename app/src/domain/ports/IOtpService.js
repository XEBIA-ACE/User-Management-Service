'use strict';

/**
 * Port — IOtpService
 *
 * Defines the contract for OTP generation and delivery.
 */
class IOtpService {
  /**
   * Generate a numeric OTP string.
   * @param {number} [length=6]
   * @returns {string}
   */
  // eslint-disable-next-line no-unused-vars
  generate(length = 6) {
    throw new Error('IOtpService.generate() not implemented');
  }

  /**
   * Send the OTP to the user (e.g. via email or SMS).
   * @param {string} destination  email address or phone number
   * @param {string} otp
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line no-unused-vars
  async send(destination, otp) {
    throw new Error('IOtpService.send() not implemented');
  }
}

module.exports = IOtpService;
