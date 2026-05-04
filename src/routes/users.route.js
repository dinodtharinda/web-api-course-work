const router = require('express').Router();

const { listUsers, getUser, updateUser, deleteUser } = require('@/controllers/users.controller');
const { authenticate, authorizeRoles } = require('@/middlewares/auth.middleware');
const { validateIdParam } = require('@/middlewares/validate.middleware');

router.use(authenticate, authorizeRoles('admin'));

/**
 * @swagger
 * /users:
 *   get:
 *     summary: 'List users'
 *     description: 'Requires an admin bearer token. Paginated.'
 *     tags:
 *       - 'Users'
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: 'page'
 *         in: 'query'
 *         required: false
 *         description: 'Page number'
 *         schema:
 *           type: 'integer'
 *           default: 1
 *           minimum: 1
 *       - name: 'pageSize'
 *         in: 'query'
 *         required: false
 *         description: 'Items per page (max 100)'
 *         schema:
 *           type: 'integer'
 *           default: 20
 *           minimum: 1
 *       - name: 'search'
 *         in: 'query'
 *         required: false
 *         description: 'Partial match on first name, last name or email'
 *         schema:
 *           type: 'string'
 *       - name: 'sortBy'
 *         in: 'query'
 *         required: false
 *         description: 'Sort field; unknown values fall back to the default'
 *         schema:
 *           type: 'string'
 *           enum:
 *             - 'firstName'
 *             - 'lastName'
 *             - 'email'
 *             - 'role'
 *             - 'isActive'
 *             - 'createdAt'
 *             - 'updatedAt'
 *       - name: 'sortOrder'
 *         in: 'query'
 *         required: false
 *         description: 'Sort direction'
 *         schema:
 *           type: 'string'
 *           enum:
 *             - 'ASC'
 *             - 'DESC'
 *       - name: 'role'
 *         in: 'query'
 *         required: false
 *         description: 'Filter by role'
 *         schema:
 *           type: 'string'
 *           enum:
 *             - 'admin'
 *             - 'station'
 *             - 'viewer'
 *     responses:
 *       '200':
 *         description: 'Users retrieved'
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
 *                   type: 'array'
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 meta:
 *                   $ref: '#/components/schemas/ListMeta'
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
router.get('/', listUsers);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: 'Get a user'
 *     description: 'Requires an admin bearer token. '
 *     tags:
 *       - 'Users'
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: 'userId'
 *         in: 'path'
 *         required: true
 *         description: 'User ID'
 *         schema:
 *           type: 'integer'
 *           example: 1
 *     responses:
 *       '200':
 *         description: 'User retrieved'
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
 *       '403':
 *         description: 'Authenticated user is not an admin'
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
router.get('/:userId', validateIdParam('userId'), getUser);

/**
 * @swagger
 * /users/{userId}:
 *   patch:
 *     summary: 'Update a user'
 *     description: 'Requires an admin bearer token. Send at least one field. Admins cannot change their own role or deactivate themselves.'
 *     tags:
 *       - 'Users'
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: 'userId'
 *         in: 'path'
 *         required: true
 *         description: 'User ID'
 *         schema:
 *           type: 'integer'
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: 'object'
 *             properties:
 *               firstName:
 *                 type: 'string'
 *               lastName:
 *                 type: 'string'
 *               role:
 *                 type: 'string'
 *                 enum:
 *                   - 'admin'
 *                   - 'station'
 *                   - 'viewer'
 *               isActive:
 *                 type: 'boolean'
 *     responses:
 *       '200':
 *         description: 'User updated'
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
 *       '400':
 *         description: 'Bad request'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
router.patch('/:userId', validateIdParam('userId'), updateUser);

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: 'Deactivate a user'
 *     description: 'Requires an admin bearer token. Soft delete: sets `isActive` to false. Admins cannot deactivate themselves.'
 *     tags:
 *       - 'Users'
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: 'userId'
 *         in: 'path'
 *         required: true
 *         description: 'User ID'
 *         schema:
 *           type: 'integer'
 *           example: 1
 *     responses:
 *       '200':
 *         description: 'User deactivated'
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
router.delete('/:userId', validateIdParam('userId'), deleteUser);

module.exports = router;
