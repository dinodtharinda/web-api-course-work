const router = require('express').Router();

const { listUsers, getUser, updateUser, deleteUser } = require('@/controllers/users.controller');
const { authenticate, authorizeRoles } = require('@/middlewares/auth.middleware');
const { validateIdParam } = require('@/middlewares/validate.middleware');

router.use(authenticate, authorizeRoles('admin'));

/**
 * @swagger
 * /users:
 *   get:
 *     summary: List users (admin-only)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *       - name: pageSize
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *       - name: search
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: sortBy
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: sortOrder
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: role
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', listUsers);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get a user (admin-only)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Error
 */
router.get('/:userId', validateIdParam('userId'), getUser);

/**
 * @swagger
 * /users/{userId}:
 *   patch:
 *     summary: Update a user (admin-only)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               role:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Error
 *       422:
 *         description: Error
 */
router.patch('/:userId', validateIdParam('userId'), updateUser);

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Deactivate a user (admin-only)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Error
 */
router.delete('/:userId', validateIdParam('userId'), deleteUser);

module.exports = router;
