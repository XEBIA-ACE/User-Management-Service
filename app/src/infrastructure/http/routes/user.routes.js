'use strict';

const { Router } = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');

const router = Router();

// All user routes require a valid JWT
router.use(authenticate);

/**
 * GET /api/v1/users/me
 */
router.get('/me', userController.getProfile);

/**
 * PATCH /api/v1/users/me
 */
router.patch(
  '/me',
  [body('name').optional().isString().trim()],
  validate,
  userController.updateProfile,
);

/**
 * DELETE /api/v1/users/me
 */
router.delete('/me', userController.deleteAccount);

module.exports = router;
