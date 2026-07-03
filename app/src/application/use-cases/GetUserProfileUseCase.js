'use strict';

/**
 * Use-case: Retrieve a user's profile.
 *
 * @param {Object} deps
 * @param {import('../../domain/ports/IUserRepository')} deps.userRepository
 */
class GetUserProfileUseCase {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  /**
   * @param {Object} dto
   * @param {string} dto.userId
   * @returns {Promise<{user: Object}>}
   */
  async execute({ userId }) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    return { user: user.toPublic() };
  }
}

module.exports = GetUserProfileUseCase;
