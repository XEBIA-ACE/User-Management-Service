'use strict';

/**
 * Use-case: Delete a user account.
 *
 * @param {Object} deps
 * @param {import('../../domain/ports/IUserRepository')} deps.userRepository
 */
class DeleteUserUseCase {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  /**
   * @param {Object} dto
   * @param {string} dto.userId
   * @returns {Promise<void>}
   */
  async execute({ userId }) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    await this.userRepository.delete(userId);
  }
}

module.exports = DeleteUserUseCase;
