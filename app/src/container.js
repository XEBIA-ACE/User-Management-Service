'use strict';

const PostgresUserRepository = require('../infrastructure/database/repositories/PostgresUserRepository');
const JwtTokenService = require('../infrastructure/auth/JwtTokenService');
const BcryptHashService = require('../infrastructure/auth/BcryptHashService');
const SimpleOtpService = require('../infrastructure/otp/SimpleOtpService');

const RegisterUserUseCase = require('../application/use-cases/RegisterUserUseCase');
const LoginUserUseCase = require('../application/use-cases/LoginUserUseCase');
const VerifyOtpUseCase = require('../application/use-cases/VerifyOtpUseCase');
const GetUserProfileUseCase = require('../application/use-cases/GetUserProfileUseCase');
const UpdateUserProfileUseCase = require('../application/use-cases/UpdateUserProfileUseCase');
const DeleteUserUseCase = require('../application/use-cases/DeleteUserUseCase');

// ── Adapters ───────────────────────────────────────────────────────────────
const userRepository = new PostgresUserRepository();
const tokenService = new JwtTokenService();
const hashService = new BcryptHashService();
const otpService = new SimpleOtpService();

// ── Use-cases ──────────────────────────────────────────────────────────────
const registerUser = new RegisterUserUseCase({ userRepository, hashService, otpService });
const loginUser = new LoginUserUseCase({ userRepository, hashService, tokenService });
const verifyOtp = new VerifyOtpUseCase({ userRepository });
const getUserProfile = new GetUserProfileUseCase({ userRepository });
const updateUserProfile = new UpdateUserProfileUseCase({ userRepository });
const deleteUser = new DeleteUserUseCase({ userRepository });

module.exports = {
  registerUser,
  loginUser,
  verifyOtp,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  tokenService,
};
