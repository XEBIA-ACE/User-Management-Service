'use strict';

const JwtTokenService = require('../../src/infrastructure/auth/JwtTokenService');
const BcryptHashService = require('../../src/infrastructure/auth/BcryptHashService');
const SimpleOtpService = require('../../src/infrastructure/otp/SimpleOtpService');

describe('JwtTokenService', () => {
  const svc = new JwtTokenService();

  it('generates and verifies a token', () => {
    const token = svc.generate({ sub: 'user-1', email: 'a@b.com' });
    expect(typeof token).toBe('string');
    const decoded = svc.verify(token);
    expect(decoded.sub).toBe('user-1');
    expect(decoded.email).toBe('a@b.com');
  });

  it('throws on invalid token', () => {
    expect(() => svc.verify('bad.token.here')).toThrow();
  });
});

describe('BcryptHashService', () => {
  const svc = new BcryptHashService();

  it('hashes and compares correctly', async () => {
    const hash = await svc.hash('mypassword');
    expect(hash).not.toBe('mypassword');
    const match = await svc.compare('mypassword', hash);
    expect(match).toBe(true);
  });

  it('returns false for wrong password', async () => {
    const hash = await svc.hash('mypassword');
    const match = await svc.compare('wrongpassword', hash);
    expect(match).toBe(false);
  });
});

describe('SimpleOtpService', () => {
  const svc = new SimpleOtpService();

  it('generates a 6-digit OTP by default', () => {
    const otp = svc.generate();
    expect(otp).toMatch(/^\d{6}$/);
  });

  it('generates OTP of requested length', () => {
    const otp = svc.generate(4);
    expect(otp).toMatch(/^\d{4}$/);
  });

  it('send() resolves without throwing', async () => {
    await expect(svc.send('test@example.com', '123456')).resolves.toBeUndefined();
  });
});
