'use strict';

const bcrypt = require('bcryptjs');
const IHashService = require('../../../domain/ports/IHashService');

/**
 * bcrypt adapter for IHashService.
 */
class BcryptHashService extends IHashService {
  constructor() {
    super();
    this.saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
  }

  /**
   * @param {string} plainText
   * @returns {Promise<string>}
   */
  async hash(plainText) {
    return bcrypt.hash(plainText, this.saltRounds);
  }

  /**
   * @param {string} plainText
   * @param {string} hash
   * @returns {Promise<boolean>}
   */
  async compare(plainText, hash) {
    return bcrypt.compare(plainText, hash);
  }
}

module.exports = BcryptHashService;
