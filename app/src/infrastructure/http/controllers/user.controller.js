'use strict';

const container = require('../../../container');

/**
 * GET /api/v1/users/me
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getProfile(req, res, next) {
  try {
    const result = await container.getUserProfile.execute({ userId: req.user.sub });
    res.status(200).json({ success: true, data: result.user });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/v1/users/me
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function updateProfile(req, res, next) {
  try {
    const { name } = req.body;
    const result = await container.updateUserProfile.execute({ userId: req.user.sub, name });
    res.status(200).json({ success: true, data: result.user });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/v1/users/me
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function deleteAccount(req, res, next) {
  try {
    await container.deleteUser.execute({ userId: req.user.sub });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, updateProfile, deleteAccount };
