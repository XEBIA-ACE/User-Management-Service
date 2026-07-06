'use strict';

/**
 * Domain entity — User
 * Pure value object; no framework dependencies.
 *
 * @typedef {Object} User
 * @property {string}      id
 * @property {string}      email
 * @property {string}      passwordHash
 * @property {string}      [name]
 * @property {boolean}     isVerified
 * @property {string|null} otpCode
 * @property {Date|null}   otpExpiresAt
 * @property {Date}        createdAt
 * @property {Date}        updatedAt
 */

class User {
  /**
   * @param {Object} props
   * @param {string}      props.id
   * @param {string}      props.email
   * @param {string}      props.passwordHash
   * @param {string}      [props.name]
   * @param {boolean}     [props.isVerified]
   * @param {string|null} [props.otpCode]
   * @param {Date|null}   [props.otpExpiresAt]
   * @param {Date}        [props.createdAt]
   * @param {Date}        [props.updatedAt]
   */
  constructor({
    id,
    email,
    passwordHash,
    name = '',
    isVerified = false,
    otpCode = null,
    otpExpiresAt = null,
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.name = name;
    this.isVerified = isVerified;
    this.otpCode = otpCode;
    this.otpExpiresAt = otpExpiresAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /** @returns {boolean} */
  isOtpValid(code) {
    if (!this.otpCode || !this.otpExpiresAt) return false;
    return this.otpCode === code && new Date() < this.otpExpiresAt;
  }

  /** @returns {Object} safe public representation (no secrets) */
  toPublic() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      isVerified: this.isVerified,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = User;
