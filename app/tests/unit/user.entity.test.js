'use strict';

const User = require('../../src/domain/entities/User');

describe('User entity', () => {
  const baseProps = {
    id: 'test-uuid',
    email: 'alice@example.com',
    passwordHash: '$2b$10$hashedpassword',
    name: 'Alice',
  };

  it('creates a User with default values', () => {
    const user = new User(baseProps);
    expect(user.id).toBe('test-uuid');
    expect(user.email).toBe('alice@example.com');
    expect(user.isVerified).toBe(false);
    expect(user.otpCode).toBeNull();
    expect(user.otpExpiresAt).toBeNull();
  });

  it('toPublic() omits passwordHash and otpCode', () => {
    const user = new User(baseProps);
    const pub = user.toPublic();
    expect(pub.passwordHash).toBeUndefined();
    expect(pub.otpCode).toBeUndefined();
    expect(pub.email).toBe('alice@example.com');
  });

  it('isOtpValid() returns true for matching, non-expired OTP', () => {
    const user = new User({
      ...baseProps,
      otpCode: '123456',
      otpExpiresAt: new Date(Date.now() + 60_000),
    });
    expect(user.isOtpValid('123456')).toBe(true);
  });

  it('isOtpValid() returns false for wrong OTP', () => {
    const user = new User({
      ...baseProps,
      otpCode: '123456',
      otpExpiresAt: new Date(Date.now() + 60_000),
    });
    expect(user.isOtpValid('000000')).toBe(false);
  });

  it('isOtpValid() returns false for expired OTP', () => {
    const user = new User({
      ...baseProps,
      otpCode: '123456',
      otpExpiresAt: new Date(Date.now() - 1),
    });
    expect(user.isOtpValid('123456')).toBe(false);
  });

  it('isOtpValid() returns false when no OTP set', () => {
    const user = new User(baseProps);
    expect(user.isOtpValid('123456')).toBe(false);
  });
});
