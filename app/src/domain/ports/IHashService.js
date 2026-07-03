'use strict';

/**
 * Port — IHashService
 *
 * Defines the contract for password hashing and comparison.
 */
class IHashService {
  /**
   * Hash a plain-text password.
   * @param {string} plainText
   * @returns {Promise<string>}
   */
  // eslint-disable-next-line no-unused-vars
  async hash(plainText) {
    throw new Error('IHashService.hash() not implemented');
  }

  /**
   * Compare a plain-text password against a stored hash.
   * @param {string} plainText
   * @param {string} hash
   * @returns {Promise<boolean>}
   */
  // eslint-disable-next-line no-unused-vars
  async compare(plainText, hash) {
    throw new Error('IHashService.compare() not implemented');
  }
}

module.exports = IHashService;
