'use strict';

/**
 * Use-case: Authenticate a user and return a JWT.
 *
 * @param {Object} deps
 * @param {import('../../domain/ports/IUserRepository')} deps.userRepository
 * @param {import('../../domain/ports/IHashService')}    deps.hashService
 * @param {import('../../domain/ports/ITokenService')}   deps.tokenService
 */
class LoginUserUseCase {
  constructor({ userRepository, hashService, tokenService }) {
    this.userRepository = userRepository;
    this.hashService = hashService;
    this.tokenService = tokenService;
  }

  /**
   * @param {Object} dto
   * @param {string} dto.email
   * @param {string} dto.password
   * @returns {Promise<{token: string, user: Object}>}
   */
  async execute({ email, password }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    const valid = await this.hashService.compare(password, user.passwordHash);
    if (!valid) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    if (!user.isVerified) {
      const err = new Error('Account not verified. Please verify your OTP.');
      err.statusCode = 403;
      throw err;
    }

    const token = this.tokenService.generate({ sub: user.id, email: user.email });
    return { token, user: user.toPublic() };
  }
}

module.exports = LoginUserUseCase;
