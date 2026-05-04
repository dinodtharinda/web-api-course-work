const router = require('express').Router();

const { register, login, me, refreshToken, logout, changePassword, adminGuardCheck } = require('@/controllers/auth.controller');
const { authenticate, authorizeRoles } = require('@/middlewares/auth.middleware');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: 'Register a new user'
 *     description: 'Public endpoint. `role` defaults to `viewer`. Email is lower-cased and must be unique.'
 *     tags:
 *       - 'Authentication'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: 'object'
 *             properties:
 *               firstName:
 *                 type: 'string'
 *                 example: 'Nimal'
 *               lastName:
 *                 type: 'string'
 *                 example: 'Perera'
 *               email:
 *                 type: 'string'
 *                 format: 'email'
 *                 example: 'admin@slpolice.lk'
 *               password:
 *                 type: 'string'
 *                 format: 'password'
 *                 example: 'SecurePassword123'
 *               role:
 *                 type: 'string'
 *                 enum:
 *                   - 'admin'
 *                   - 'station'
 *                   - 'viewer'
 *                 default: 'viewer'
 *             required:
 *               - 'firstName'
 *               - 'lastName'
 *               - 'email'
 *               - 'password'
 *     responses:
 *       '201':
 *         description: 'User registered'
 *         content:
 *           application/json:
 *             schema:
 *               type: 'object'
 *               properties:
 *                 success:
 *                   type: 'boolean'
 *                   example: true
 *                 message:
 *                   type: 'string'
 *                   example: 'User registered'
 *                 data:
 *                   type: 'object'
 *                   properties:
 *                     id:
 *                       type: 'integer'
 *                     firstName:
 *                       type: 'string'
 *                     lastName:
 *                       type: 'string'
 *                     email:
 *                       type: 'string'
 *                       format: 'email'
 *                     role:
 *                       type: 'string'
 *                       enum:
 *                         - 'admin'
 *                         - 'station'
 *                         - 'viewer'
 *       '400':
 *         description: 'Bad request'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '409':
 *         description: 'Email is already registered'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 'Login'
 *     description: 'Returns a JWT access token. Deactivated users cannot log in.'
 *     tags:
 *       - 'Authentication'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: 'object'
 *             properties:
 *               email:
 *                 type: 'string'
 *                 format: 'email'
 *                 example: 'admin@slpolice.lk'
 *               password:
 *                 type: 'string'
 *                 format: 'password'
 *                 example: 'SecurePassword123'
 *             required:
 *               - 'email'
 *               - 'password'
 *     responses:
 *       '200':
 *         description: 'Login successful'
 *         content:
 *           application/json:
 *             schema:
 *               type: 'object'
 *               properties:
 *                 success:
 *                   type: 'boolean'
 *                   example: true
 *                 message:
 *                   type: 'string'
 *                   example: 'Login successful'
 *                 data:
 *                   $ref: '#/components/schemas/AuthToken'
 *       '400':
 *         description: 'Bad request'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: 'Invalid credentials'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: 'Get current user profile'
 *     description: 'Returns the profile of the token owner.'
 *     tags:
 *       - 'Authentication'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: 'Profile'
 *         content:
 *           application/json:
 *             schema:
 *               type: 'object'
 *               properties:
 *                 success:
 *                   type: 'boolean'
 *                   example: true
 *                 message:
 *                   type: 'string'
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       '401':
 *         description: 'Missing, invalid or expired bearer token'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: 'User not found'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/me', authenticate, me);

/**
 * @swagger
 * /auth/admin-check:
 *   get:
 *     summary: 'Verify admin access'
 *     description: 'Succeeds only for admin tokens.'
 *     tags:
 *       - 'Authentication'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: 'Admin access granted'
 *         content:
 *           application/json:
 *             schema:
 *               type: 'object'
 *               properties:
 *                 success:
 *                   type: 'boolean'
 *                   example: true
 *                 message:
 *                   type: 'string'
 *       '401':
 *         description: 'Missing, invalid or expired bearer token'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: 'Authenticated user is not an admin'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/admin-check', authenticate, authorizeRoles('admin'), adminGuardCheck);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: 'Refresh access token'
 *     description: 'Exchanges a still-valid access token for a new one. There are no separate refresh tokens.'
 *     tags:
 *       - 'Authentication'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: 'New token issued'
 *         content:
 *           application/json:
 *             schema:
 *               type: 'object'
 *               properties:
 *                 success:
 *                   type: 'boolean'
 *                   example: true
 *                 message:
 *                   type: 'string'
 *                 data:
 *                   $ref: '#/components/schemas/AuthToken'
 *       '401':
 *         description: 'Missing, invalid or expired bearer token'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/refresh', authenticate, refreshToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: 'Logout'
 *     description: 'Tokens are stateless JWTs, so this only acknowledges the request; the client must discard the token.'
 *     tags:
 *       - 'Authentication'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: 'Logged out'
 *         content:
 *           application/json:
 *             schema:
 *               type: 'object'
 *               properties:
 *                 success:
 *                   type: 'boolean'
 *                   example: true
 *                 message:
 *                   type: 'string'
 *       '401':
 *         description: 'Missing, invalid or expired bearer token'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/logout', authenticate, logout);

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: 'Change password'
 *     description: 'Changes the password of the token owner.'
 *     tags:
 *       - 'Authentication'
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: 'object'
 *             properties:
 *               currentPassword:
 *                 type: 'string'
 *                 format: 'password'
 *               newPassword:
 *                 type: 'string'
 *                 format: 'password'
 *                 minLength: 8
 *             required:
 *               - 'currentPassword'
 *               - 'newPassword'
 *     responses:
 *       '200':
 *         description: 'Password changed'
 *         content:
 *           application/json:
 *             schema:
 *               type: 'object'
 *               properties:
 *                 success:
 *                   type: 'boolean'
 *                   example: true
 *                 message:
 *                   type: 'string'
 *       '400':
 *         description: 'Bad request'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: 'Missing token or current password is incorrect'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: 'User not found'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '422':
 *         description: 'Validation failed'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/change-password', authenticate, changePassword);

module.exports = router;
