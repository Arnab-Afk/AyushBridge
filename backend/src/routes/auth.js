const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Simple authentication endpoints (ABHA removed)
 */

/**
 * @swagger
 * /auth/validate:
 *   post:
 *     summary: Simple token validation (for development)
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Always returns valid for development
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                 user:
 *                   type: object
 */
router.post('/validate', asyncHandler(async (req, res) => {
  // Simple validation for development - always return valid
  res.json({
    valid: true,
    user: {
      id: 'dev-user',
      name: 'Development User',
      role: 'physician',
      facility: 'Development Environment'
    },
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  });
}));

/**
 * @swagger
 * /auth/status:
 *   get:
 *     summary: Get authentication status
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Authentication status
 */
router.get('/status', asyncHandler(async (req, res) => {
  res.json({
    message: 'Authentication system simplified for development',
    abha_removed: true,
    development_mode: true
  });
}));

module.exports = router;
