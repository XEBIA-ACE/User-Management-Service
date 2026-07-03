'use strict';

const container = require('../../../container');

/**
 * POST /api/v1/auth/register
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;
    const result = await container.registerUser.execute({ email, password, name });
    res.status(201).json({ success: true, data: result.user });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/auth/login
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await container.loginUser.execute({ email, password });
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/auth/verify-otp
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function verifyOtp(req, res, next) {
  try {
    const { email, otp } = req.body;
    const result = await container.verifyOtp.execute({ email, otp });
    res.status(200).json({ success: true, data: result.user });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, verifyOtp };
