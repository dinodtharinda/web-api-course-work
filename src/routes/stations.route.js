const router = require('express').Router();

const {
  listStations,
  getStation,
  createStation,
  updateStation,
  deleteStation,
  listStationVehicles,
  getStationTrackingHistory,
} = require('@/controllers/stations.controller');
const { authenticate, authorizeRoles } = require('@/middlewares/auth.middleware');
const { validateStationIdParam, validateDateRangeQuery } = require('@/middlewares/validate.middleware');

/**
 * @swagger
 * /stations:
 *   get:
 *     summary: 'List police stations'
 *     description: 'Paginated. Search matches name or code.'
 *     tags:
 *       - 'Police Stations'
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
 *         description: 'Partial match on name or code'
 *         schema:
 *           type: 'string'
 *       - name: 'sortBy'
 *         in: 'query'
 *         required: false
 *         description: 'Sort field; unknown values fall back to the default'
 *         schema:
 *           type: 'string'
 *           enum:
 *             - 'name'
 *             - 'code'
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
 *         description: 'Stations retrieved'
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
 *                     $ref: '#/components/schemas/PoliceStation'
 *                 meta:
 *                   $ref: '#/components/schemas/ListMeta'
 */
router.get('/', listStations);

/**
 * @swagger
 * /stations/{stationId}/tracking/history:
 *   get:
 *     summary: 'Get tracking history for a station'
 *     description: 'All pings of vehicles in the station''s district, newest first. Not paginated.'
 *     tags:
 *       - 'Police Stations'
 *     parameters:
 *       - name: 'stationId'
 *         in: 'path'
 *         required: true
 *         description: 'Police station ID'
 *         schema:
 *           type: 'integer'
 *           example: 1
 *       - name: 'from'
 *         in: 'query'
 *         required: false
 *         description: 'Range start (ISO 8601 date-time). Must be supplied together with `to`.'
 *         schema:
 *           type: 'string'
 *           example: '2025-04-25T00:00:00Z'
 *           format: 'date-time'
 *       - name: 'to'
 *         in: 'query'
 *         required: false
 *         description: 'Range end (ISO 8601 date-time), must be >= `from`.'
 *         schema:
 *           type: 'string'
 *           example: '2025-05-02T23:59:59Z'
 *           format: 'date-time'
 *     responses:
 *       '200':
 *         description: 'History retrieved'
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
 *                   type: 'object'
 *                   properties:
 *                     station:
 *                       $ref: '#/components/schemas/PoliceStation'
 *                     count:
 *                       type: 'integer'
 *                     history:
 *                       type: 'array'
 *                       items:
 *                         $ref: '#/components/schemas/StationHistoryPing'
 *       '404':
 *         description: 'Police station not found'
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
router.get('/:stationId/tracking/history', validateStationIdParam, validateDateRangeQuery(), getStationTrackingHistory);

/**
 * @swagger
 * /stations:
 *   post:
 *     summary: 'Create a police station'
 *     description: 'Requires an admin bearer token. `code` is upper-cased and must be unique.'
 *     tags:
 *       - 'Police Stations'
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: 'object'
 *             properties:
 *               name:
 *                 type: 'string'
 *                 example: 'Kandy Police Station'
 *               code:
 *                 type: 'string'
 *                 example: 'KDY01'
 *               districtId:
 *                 type: 'integer'
 *                 example: 1
 *             required:
 *               - 'name'
 *               - 'code'
 *               - 'districtId'
 *     responses:
 *       '201':
 *         description: 'Station created'
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
 *                   $ref: '#/components/schemas/PoliceStation'
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
router.post('/', authenticate, authorizeRoles('admin'), createStation);

/**
 * @swagger
 * /stations/{stationId}:
 *   get:
 *     summary: 'Get a police station'
 *     description: 'Includes the district.'
 *     tags:
 *       - 'Police Stations'
 *     parameters:
 *       - name: 'stationId'
 *         in: 'path'
 *         required: true
 *         description: 'Police station ID'
 *         schema:
 *           type: 'integer'
 *           example: 1
 *     responses:
 *       '200':
 *         description: 'Station retrieved'
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
 *                   $ref: '#/components/schemas/PoliceStation'
 *       '404':
 *         description: 'Police station not found'
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
router.get('/:stationId', validateStationIdParam, getStation);

/**
 * @swagger
 * /stations/{stationId}:
 *   put:
 *     summary: 'Update a police station'
 *     description: 'Requires an admin bearer token. Send at least one field; omitted fields are unchanged.'
 *     tags:
 *       - 'Police Stations'
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: 'stationId'
 *         in: 'path'
 *         required: true
 *         description: 'Police station ID'
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
 *               name:
 *                 type: 'string'
 *               code:
 *                 type: 'string'
 *               districtId:
 *                 type: 'integer'
 *     responses:
 *       '200':
 *         description: 'Station updated'
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
 *                   $ref: '#/components/schemas/PoliceStation'
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
 *         description: 'Police station not found'
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
router.put('/:stationId', authenticate, authorizeRoles('admin'), validateStationIdParam, updateStation);

/**
 * @swagger
 * /stations/{stationId}:
 *   delete:
 *     summary: 'Delete a police station'
 *     description: 'Requires an admin bearer token. Permanent delete.'
 *     tags:
 *       - 'Police Stations'
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: 'stationId'
 *         in: 'path'
 *         required: true
 *         description: 'Police station ID'
 *         schema:
 *           type: 'integer'
 *           example: 1
 *     responses:
 *       '200':
 *         description: 'Station deleted'
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
 *         description: 'Police station not found'
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
router.delete('/:stationId', authenticate, authorizeRoles('admin'), validateStationIdParam, deleteStation);

/**
 * @swagger
 * /stations/{stationId}/vehicles:
 *   get:
 *     summary: 'List vehicles in a station''s jurisdiction'
 *     description: 'Vehicles registered in the same district as the station. Paginated.'
 *     tags:
 *       - 'Police Stations'
 *     parameters:
 *       - name: 'stationId'
 *         in: 'path'
 *         required: true
 *         description: 'Police station ID'
 *         schema:
 *           type: 'integer'
 *           example: 1
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
 *       '404':
 *         description: 'Police station not found'
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
router.get('/:stationId/vehicles', validateStationIdParam, listStationVehicles);

module.exports = router;