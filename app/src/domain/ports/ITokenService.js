'use strict';

/**
 * Port — ITokenService
 *
 * Defines the contract for JWT token generation and verification.
 */
class ITokenService {
  /**
   * Generate a signed JWT for the given payload.
   * @param {Object} payload
   * @returns {string}
   */
  // eslint-disable-next-line no-unused-vars
  generate(payload) {
    throw new Error('ITokenService.generate() not implemented');
  }

  /**
   * Verify and decode a JWT.
   * @param {string} token
   * @returns {Object} decoded payload
   */
  // eslint-disable-next-line no-unused-vars
  verify(token) {
    throw new Error('ITokenService.verify() not implemented');
  }
}

module.exports = ITokenService;
