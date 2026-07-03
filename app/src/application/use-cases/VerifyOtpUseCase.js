'use strict';

/**
 * Use-case: Verify a user's OTP and mark the account as verified.
 *
 * @param {Object} deps
 * @param {import('../../domain/ports/IUserRepository')} deps.userRepository
 */
class VerifyOtpUseCase {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  /**
   * @param {Object} dto
   * @param {string} dto.email
   * @param {string} dto.otp
   * @returns {Promise<{user: Object}>}
   */
  async execute({ email, otp }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    if (!user.isOtpValid(otp)) {
      const err = new Error('Invalid or expired OTP');
      err.statusCode = 400;
      throw err;
    }

    user.isVerified = true;
    user.otpCode = null;
    user.otpExpiresAt = null;
    user.updatedAt = new Date();

    const updated = await this.userRepository.update(user);
    return { user: updated.toPublic() };
  }
}

module.exports = VerifyOtpUseCase;
