const router = require('express').Router();

const { listDevices, getDevice, createDevice, updateDevice, deleteDevice } = require('@/controllers/devices.controller');
const { authenticate, authorizeRoles } = require('@/middlewares/auth.middleware');
const { validateDeviceSerialParam } = require('@/middlewares/validate.middleware');

router.use(authenticate, authorizeRoles('admin'));

/**
 * @swagger
 * /devices:
 *   get:
 *     summary: 'List tracking devices'
 *     description: 'Requires an admin bearer token. Paginated.'
 *     tags:
 *       - 'Tracking Devices'
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
 *         description: 'Partial match on device serial'
 *         schema:
 *           type: 'string'
 *       - name: 'sortBy'
 *         in: 'query'
 *         required: false
 *         description: 'Sort field; unknown values fall back to the default'
 *         schema:
 *           type: 'string'
 *           enum:
 *             - 'deviceSerial'
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
 *       - name: 'isActive'
 *         in: 'query'
 *         required: false
 *         description: 'Filter by active state'
 *         schema:
 *           type: 'boolean'
 *     responses:
 *       '200':
 *         description: 'Devices retrieved'
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
 *                     $ref: '#/components/schemas/TrackingDevice'
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
router.get('/', listDevices);

/**
 * @swagger
 * /devices:
 *   post:
 *     summary: 'Register a tracking device for a vehicle'
 *     description: 'Requires an admin bearer token. A vehicle can have only one device.'
 *     tags:
 *       - 'Tracking Devices'
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: 'object'
 *             properties:
 *               deviceSerial:
 *                 type: 'string'
 *                 example: 'DEV-0002'
 *               registrationNo:
 *                 type: 'string'
 *                 example: 'NA-1234'
 *             required:
 *               - 'deviceSerial'
 *               - 'registrationNo'
 *     responses:
 *       '201':
 *         description: 'Device created'
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
 *                   $ref: '#/components/schemas/TrackingDevice'
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
 *         description: 'Vehicle not found'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '409':
 *         description: 'Vehicle already has a device, or serial already used'
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
router.post('/', createDevice);

/**
 * @swagger
 * /devices/{deviceSerial}:
 *   get:
 *     summary: 'Get a tracking device'
 *     description: 'Requires an admin bearer token. '
 *     tags:
 *       - 'Tracking Devices'
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: 'deviceSerial'
 *         in: 'path'
 *         required: true
 *         description: 'Tracking device serial'
 *         schema:
 *           type: 'string'
 *           example: 'DEV-0001'
 *     responses:
 *       '200':
 *         description: 'Device retrieved'
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
 *                   $ref: '#/components/schemas/TrackingDevice'
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
 *         description: 'Tracking device not found'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:deviceSerial', validateDeviceSerialParam, getDevice);

/**
 * @swagger
 * /devices/{deviceSerial}:
 *   patch:
 *     summary: 'Update a tracking device'
 *     description: 'Requires an admin bearer token. Send at least one field.'
 *     tags:
 *       - 'Tracking Devices'
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: 'deviceSerial'
 *         in: 'path'
 *         required: true
 *         description: 'Tracking device serial'
 *         schema:
 *           type: 'string'
 *           example: 'DEV-0001'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: 'object'
 *             properties:
 *               deviceSerial:
 *                 type: 'string'
 *               isActive:
 *                 type: 'boolean'
 *     responses:
 *       '200':
 *         description: 'Device updated'
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
 *                   $ref: '#/components/schemas/TrackingDevice'
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
 *         description: 'Tracking device not found'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '409':
 *         description: 'Duplicate value'
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
router.patch('/:deviceSerial', validateDeviceSerialParam, updateDevice);

/**
 * @swagger
 * /devices/{deviceSerial}:
 *   delete:
 *     summary: 'Delete a tracking device'
 *     description: 'Requires an admin bearer token. Permanent delete.'
 *     tags:
 *       - 'Tracking Devices'
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: 'deviceSerial'
 *         in: 'path'
 *         required: true
 *         description: 'Tracking device serial'
 *         schema:
 *           type: 'string'
 *           example: 'DEV-0001'
 *     responses:
 *       '200':
 *         description: 'Device deleted'
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
 *       '404':
 *         description: 'Tracking device not found'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:deviceSerial', validateDeviceSerialParam, deleteDevice);

module.exports = router;
