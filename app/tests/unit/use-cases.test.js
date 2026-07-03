'use strict';

const RegisterUserUseCase = require('../../src/application/use-cases/RegisterUserUseCase');
const LoginUserUseCase = require('../../src/application/use-cases/LoginUserUseCase');
const VerifyOtpUseCase = require('../../src/application/use-cases/VerifyOtpUseCase');
const User = require('../../src/domain/entities/User');

// ── Helpers ────────────────────────────────────────────────────────────────

function makeUser(overrides = {}) {
  return new User({
    id: 'user-1',
    email: 'bob@example.com',
    passwordHash: 'hashed',
    name: 'Bob',
    isVerified: true,
    otpCode: null,
    otpExpiresAt: null,
    ...overrides,
  });
}

// ── RegisterUserUseCase ────────────────────────────────────────────────────

describe('RegisterUserUseCase', () => {
  it('creates a new user and sends OTP', async () => {
    const userRepository = {
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation(async (u) => u),
    };
    const hashService = { hash: jest.fn().mockResolvedValue('hashed') };
    const otpService = { generate: jest.fn().mockReturnValue('654321'), send: jest.fn().mockResolvedValue() };

    const useCase = new RegisterUserUseCase({ userRepository, hashService, otpService });
    const result = await useCase.execute({ email: 'bob@example.com', password: 'secret123', name: 'Bob' });

    expect(userRepository.create).toHaveBeenCalledTimes(1);
    expect(otpService.send).toHaveBeenCalledWith('bob@example.com', '654321');
    expect(result.user.email).toBe('bob@example.com');
  });

  it('throws 409 when email already exists', async () => {
    const userRepository = { findByEmail: jest.fn().mockResolvedValue(makeUser()) };
    const hashService = { hash: jest.fn() };
    const otpService = { generate: jest.fn(), send: jest.fn() };

    const useCase = new RegisterUserUseCase({ userRepository, hashService, otpService });
    await expect(useCase.execute({ email: 'bob@example.com', password: 'secret123' }))
      .rejects.toMatchObject({ statusCode: 409 });
  });
});

// ── LoginUserUseCase ───────────────────────────────────────────────────────

describe('LoginUserUseCase', () => {
  it('returns a token for valid credentials', async () => {
    const user = makeUser();
    const userRepository = { findByEmail: jest.fn().mockResolvedValue(user) };
    const hashService = { compare: jest.fn().mockResolvedValue(true) };
    const tokenService = { generate: jest.fn().mockReturnValue('jwt-token') };

    const useCase = new LoginUserUseCase({ userRepository, hashService, tokenService });
    const result = await useCase.execute({ email: 'bob@example.com', password: 'secret123' });

    expect(result.token).toBe('jwt-token');
    expect(result.user.email).toBe('bob@example.com');
  });

  it('throws 401 for unknown email', async () => {
    const userRepository = { findByEmail: jest.fn().mockResolvedValue(null) };
    const hashService = { compare: jest.fn() };
    const tokenService = { generate: jest.fn() };

    const useCase = new LoginUserUseCase({ userRepository, hashService, tokenService });
    await expect(useCase.execute({ email: 'x@x.com', password: 'pw' }))
      .rejects.toMatchObject({ statusCode: 401 });
  });

  it('throws 401 for wrong password', async () => {
    const user = makeUser();
    const userRepository = { findByEmail: jest.fn().mockResolvedValue(user) };
    const hashService = { compare: jest.fn().mockResolvedValue(false) };
    const tokenService = { generate: jest.fn() };

    const useCase = new LoginUserUseCase({ userRepository, hashService, tokenService });
    await expect(useCase.execute({ email: 'bob@example.com', password: 'wrong' }))
      .rejects.toMatchObject({ statusCode: 401 });
  });

  it('throws 403 for unverified account', async () => {
    const user = makeUser({ isVerified: false });
    const userRepository = { findByEmail: jest.fn().mockResolvedValue(user) };
    const hashService = { compare: jest.fn().mockResolvedValue(true) };
    const tokenService = { generate: jest.fn() };

    const useCase = new LoginUserUseCase({ userRepository, hashService, tokenService });
    await expect(useCase.execute({ email: 'bob@example.com', password: 'secret123' }))
      .rejects.toMatchObject({ statusCode: 403 });
  });
});

// ── VerifyOtpUseCase ───────────────────────────────────────────────────────

describe('VerifyOtpUseCase', () => {
  it('marks user as verified on valid OTP', async () => {
    const user = makeUser({
      isVerified: false,
      otpCode: '111111',
      otpExpiresAt: new Date(Date.now() + 60_000),
    });
    const updated = makeUser({ isVerified: true });
    const userRepository = {
      findByEmail: jest.fn().mockResolvedValue(user),
      update: jest.fn().mockResolvedValue(updated),
    };

    const useCase = new VerifyOtpUseCase({ userRepository });
    const result = await useCase.execute({ email: 'bob@example.com', otp: '111111' });

    expect(userRepository.update).toHaveBeenCalledTimes(1);
    expect(result.user.isVerified).toBe(true);
  });

  it('throws 400 for invalid OTP', async () => {
    const user = makeUser({
      isVerified: false,
      otpCode: '111111',
      otpExpiresAt: new Date(Date.now() + 60_000),
    });
    const userRepository = { findByEmail: jest.fn().mockResolvedValue(user) };

    const useCase = new VerifyOtpUseCase({ userRepository });
    await expect(useCase.execute({ email: 'bob@example.com', otp: '000000' }))
      .rejects.toMatchObject({ statusCode: 400 });
  });

  it('throws 404 when user not found', async () => {
    const userRepository = { findByEmail: jest.fn().mockResolvedValue(null) };

    const useCase = new VerifyOtpUseCase({ userRepository });
    await expect(useCase.execute({ email: 'nobody@example.com', otp: '111111' }))
      .rejects.toMatchObject({ statusCode: 404 });
  });
});
