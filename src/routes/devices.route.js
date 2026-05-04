const router = require('express').Router();

const { listDevices, getDevice, createDevice, updateDevice, deleteDevice } = require('@/controllers/devices.controller');
const { authenticate, authorizeRoles } = require('@/middlewares/auth.middleware');
const { validateDeviceSerialParam } = require('@/middlewares/validate.middleware');

router.use(authenticate, authorizeRoles('admin'));

/**
 * @swagger
 * /devices:
 *   get:
 *     summary: List tracking devices (admin-only)
 *     tags:
 *       - Tracking Devices
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
 *       - name: isActive
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', listDevices);

/**
 * @swagger
 * /devices:
 *   post:
 *     summary: Register a tracking device for a vehicle (admin-only)
 *     tags:
 *       - Tracking Devices
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceSerial:
 *                 type: string
 *               registrationNo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Success
 *       404:
 *         description: Error
 *       409:
 *         description: Error
 *       422:
 *         description: Error
 */
router.post('/', createDevice);

/**
 * @swagger
 * /devices/{deviceSerial}:
 *   get:
 *     summary: Get a tracking device (admin-only)
 *     tags:
 *       - Tracking Devices
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: deviceSerial
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Error
 */
router.get('/:deviceSerial', validateDeviceSerialParam, getDevice);

/**
 * @swagger
 * /devices/{deviceSerial}:
 *   patch:
 *     summary: Update a tracking device (admin-only)
 *     tags:
 *       - Tracking Devices
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: deviceSerial
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceSerial:
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
router.patch('/:deviceSerial', validateDeviceSerialParam, updateDevice);

/**
 * @swagger
 * /devices/{deviceSerial}:
 *   delete:
 *     summary: Delete a tracking device (admin-only)
 *     tags:
 *       - Tracking Devices
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: deviceSerial
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Error
 */
router.delete('/:deviceSerial', validateDeviceSerialParam, deleteDevice);

module.exports = router;
