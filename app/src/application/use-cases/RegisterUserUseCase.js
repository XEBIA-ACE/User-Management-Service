'use strict';

const { v4: uuidv4 } = require('uuid');
const User = require('../../domain/entities/User');

/**
 * Use-case: Register a new user.
 *
 * @param {Object} deps
 * @param {import('../../domain/ports/IUserRepository')} deps.userRepository
 * @param {import('../../domain/ports/IHashService')}    deps.hashService
 * @param {import('../../domain/ports/IOtpService')}     deps.otpService
 */
class RegisterUserUseCase {
  constructor({ userRepository, hashService, otpService }) {
    this.userRepository = userRepository;
    this.hashService = hashService;
    this.otpService = otpService;
  }

  /**
   * @param {Object} dto
   * @param {string} dto.email
   * @param {string} dto.password
   * @param {string} [dto.name]
   * @returns {Promise<{user: Object, otp: string}>}
   */
  async execute({ email, password, name }) {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      const err = new Error('Email already registered');
      err.statusCode = 409;
      throw err;
    }

    const passwordHash = await this.hashService.hash(password);
    const otp = this.otpService.generate();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    const user = new User({
      id: uuidv4(),
      email,
      passwordHash,
      name,
      isVerified: false,
      otpCode: otp,
      otpExpiresAt,
    });

    const saved = await this.userRepository.create(user);
    await this.otpService.send(email, otp);

    return { user: saved.toPublic(), otp };
  }
}

module.exports = RegisterUserUseCase;
