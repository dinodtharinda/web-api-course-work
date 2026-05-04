const router = require('express').Router();

const { createVehicle, getVehicle, updateVehicle, deleteVehicle, listVehicles, listVehiclePings } = require('@/controllers/vehicles.controller');
const { authenticate, authorizeRoles } = require('@/middlewares/auth.middleware');
const { validateRegistrationNoParam } = require('@/middlewares/validate.middleware');

/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: 'List vehicles'
 *     description: 'Paginated, includes district and tracking device.'
 *     tags:
 *       - 'Vehicles'
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
 *         description: 'Partial match on registration number or owner name'
 *         schema:
 *           type: 'string'
 *       - name: 'sortBy'
 *         in: 'query'
 *         required: false
 *         description: 'Sort field; unknown values fall back to the default'
 *         schema:
 *           type: 'string'
 *           enum:
 *             - 'registrationNo'
 *             - 'ownerName'
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
 *     responses:
 *       '200':
 *         description: 'Vehicles retrieved'
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
 *                     $ref: '#/components/schemas/Vehicle'
 *                 meta:
 *                   $ref: '#/components/schemas/ListMeta'
 */
router.get('/', listVehicles);

/**
 * @swagger
 * /vehicles/{registrationNo}/pings:
 *   get:
 *     summary: 'List all pings for a vehicle'
 *     description: 'Newest first. Not paginated.'
 *     tags:
 *       - 'Vehicles'
 *     parameters:
 *       - name: 'registrationNo'
 *         in: 'path'
 *         required: true
 *         description: 'Vehicle registration number (case-insensitive, normalised to upper case)'
 *         schema:
 *           type: 'string'
 *           example: 'NA-1234'
 *     responses:
 *       '200':
 *         description: 'Pings retrieved'
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
 *                     $ref: '#/components/schemas/VehiclePing'
 *       '404':
 *         description: 'Vehicle not found'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:registrationNo/pings', validateRegistrationNoParam, listVehiclePings);

/**
 * @swagger
 * /vehicles:
 *   post:
 *     summary: 'Create a vehicle with its tracking device'
 *     description: 'Currently public (no token required). `registrationNo` is upper-cased. A tracking device is created together with the vehicle.'
 *     tags:
 *       - 'Vehicles'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: 'object'
 *             properties:
 *               registrationNo:
 *                 type: 'string'
 *                 example: 'NA-1234'
 *               ownerName:
 *                 type: 'string'
 *                 example: 'John Doe'
 *               districtId:
 *                 type: 'integer'
 *                 example: 1
 *               deviceSerial:
 *                 type: 'string'
 *                 example: 'DEV-0001'
 *             required:
 *               - 'registrationNo'
 *               - 'ownerName'
 *               - 'districtId'
 *               - 'deviceSerial'
 *     responses:
 *       '201':
 *         description: 'Vehicle created'
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
 *                   $ref: '#/components/schemas/Vehicle'
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
router.post('/', createVehicle);

/**
 * @swagger
 * /vehicles/{registrationNo}:
 *   get:
 *     summary: 'Get a vehicle'
 *     description: 'Includes district and tracking device.'
 *     tags:
 *       - 'Vehicles'
 *     parameters:
 *       - name: 'registrationNo'
 *         in: 'path'
 *         required: true
 *         description: 'Vehicle registration number (case-insensitive, normalised to upper case)'
 *         schema:
 *           type: 'string'
 *           example: 'NA-1234'
 *     responses:
 *       '200':
 *         description: 'Vehicle retrieved'
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
 *                   $ref: '#/components/schemas/Vehicle'
 *       '404':
 *         description: 'Vehicle not found'
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
router.get('/:registrationNo', validateRegistrationNoParam, getVehicle);

/**
 * @swagger
 * /vehicles/{registrationNo}:
 *   patch:
 *     summary: 'Update a vehicle'
 *     description: 'Requires an admin bearer token. Send at least one field.'
 *     tags:
 *       - 'Vehicles'
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: 'registrationNo'
 *         in: 'path'
 *         required: true
 *         description: 'Vehicle registration number (case-insensitive, normalised to upper case)'
 *         schema:
 *           type: 'string'
 *           example: 'NA-1234'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: 'object'
 *             properties:
 *               ownerName:
 *                 type: 'string'
 *               districtId:
 *                 type: 'integer'
 *               isActive:
 *                 type: 'boolean'
 *     responses:
 *       '200':
 *         description: 'Vehicle updated'
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
 *                   $ref: '#/components/schemas/Vehicle'
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
 *         description: 'Vehicle not found'
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
router.patch('/:registrationNo', authenticate, authorizeRoles('admin'), validateRegistrationNoParam, updateVehicle);

/**
 * @swagger
 * /vehicles/{registrationNo}:
 *   delete:
 *     summary: 'Deactivate a vehicle'
 *     description: 'Requires an admin bearer token. Soft delete: sets `isActive` to false.'
 *     tags:
 *       - 'Vehicles'
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: 'registrationNo'
 *         in: 'path'
 *         required: true
 *         description: 'Vehicle registration number (case-insensitive, normalised to upper case)'
 *         schema:
 *           type: 'string'
 *           example: 'NA-1234'
 *     responses:
 *       '200':
 *         description: 'Vehicle deactivated'
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
 *         description: 'Vehicle not found'
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
router.delete('/:registrationNo', authenticate, authorizeRoles('admin'), validateRegistrationNoParam, deleteVehicle);

module.exports = router;