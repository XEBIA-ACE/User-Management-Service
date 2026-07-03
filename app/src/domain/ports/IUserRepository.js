'use strict';

/**
 * Port — IUserRepository
 *
 * Defines the contract that any persistence adapter must fulfil.
 * Concrete implementations live in src/infrastructure/database/repositories/.
 */
class IUserRepository {
  /**
   * Persist a new user.
   * @param {import('../entities/User')} user
   * @returns {Promise<import('../entities/User')>}
   */
  // eslint-disable-next-line no-unused-vars
  async create(user) {
    throw new Error('IUserRepository.create() not implemented');
  }

  /**
   * Find a user by their unique identifier.
   * @param {string} id
   * @returns {Promise<import('../entities/User')|null>}
   */
  // eslint-disable-next-line no-unused-vars
  async findById(id) {
    throw new Error('IUserRepository.findById() not implemented');
  }

  /**
   * Find a user by email address.
   * @param {string} email
   * @returns {Promise<import('../entities/User')|null>}
   */
  // eslint-disable-next-line no-unused-vars
  async findByEmail(email) {
    throw new Error('IUserRepository.findByEmail() not implemented');
  }

  /**
   * Persist changes to an existing user.
   * @param {import('../entities/User')} user
   * @returns {Promise<import('../entities/User')>}
   */
  // eslint-disable-next-line no-unused-vars
  async update(user) {
    throw new Error('IUserRepository.update() not implemented');
  }

  /**
   * Remove a user by their unique identifier.
   * @param {string} id
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line no-unused-vars
  async delete(id) {
    throw new Error('IUserRepository.delete() not implemented');
  }
}

module.exports = IUserRepository;
