'use strict';

/**
 * Use-case: Update a user's profile fields.
 *
 * @param {Object} deps
 * @param {import('../../domain/ports/IUserRepository')} deps.userRepository
 */
class UpdateUserProfileUseCase {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  /**
   * @param {Object} dto
   * @param {string} dto.userId
   * @param {string} [dto.name]
   * @returns {Promise<{user: Object}>}
   */
  async execute({ userId, name }) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    if (name !== undefined) user.name = name;
    user.updatedAt = new Date();

    const updated = await this.userRepository.update(user);
    return { user: updated.toPublic() };
  }
}

module.exports = UpdateUserProfileUseCase;
