const router = require('express').Router();

const { ingestLocationPing, getLatestLocation, getMovementHistory, getFilteredHistory } = require('@/controllers/locations.controller');
const {
	validateRegistrationNoParam,
	validateTrackingPing,
	validateDateRangeQuery,
	validateProvinceDistrictFilterQuery,
} = require('@/middlewares/validate.middleware');

/**
 * @swagger
 * /tracking/pings:
 *   post:
 *     summary: 'Ingest a location ping'
 *     description: 'Currently public (no token required).'
 *     tags:
 *       - 'Tracking & Location'
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
 *               latitude:
 *                 type: 'number'
 *                 example: 6.9271
 *               longitude:
 *                 type: 'number'
 *                 example: 79.8612
 *               recordedAt:
 *                 type: 'string'
 *                 format: 'date-time'
 *                 description: 'Defaults to now'
 *                 example: '2025-05-02T10:30:00Z'
 *               sourceType:
 *                 type: 'string'
 *                 default: 'device'
 *                 example: 'device'
 *             required:
 *               - 'registrationNo'
 *               - 'latitude'
 *               - 'longitude'
 *     responses:
 *       '201':
 *         description: 'Ping ingested'
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
 *                   $ref: '#/components/schemas/LocationPing'
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
router.post('/pings', validateTrackingPing, ingestLocationPing);

/**
 * @swagger
 * /tracking/history:
 *   get:
 *     summary: 'Get tracking history filtered by province or district'
 *     description: 'At least one of `provinceId` or `districtId` is required. Not paginated, newest first.'
 *     tags:
 *       - 'Tracking & Location'
 *     parameters:
 *       - name: 'provinceId'
 *         in: 'query'
 *         required: false
 *         description: 'Province ID'
 *         schema:
 *           type: 'integer'
 *           example: 1
 *       - name: 'districtId'
 *         in: 'query'
 *         required: false
 *         description: 'District ID'
 *         schema:
 *           type: 'integer'
 *           example: 1
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
 *                     filters:
 *                       type: 'object'
 *                       properties:
 *                         provinceId:
 *                           type: 'integer'
 *                           nullable: true
 *                         districtId:
 *                           type: 'integer'
 *                           nullable: true
 *                     count:
 *                       type: 'integer'
 *                     history:
 *                       type: 'array'
 *                       items:
 *                         $ref: '#/components/schemas/FilteredHistoryPing'
 *       '422':
 *         description: 'Validation failed'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/history', validateProvinceDistrictFilterQuery, getFilteredHistory);

/**
 * @swagger
 * /tracking/vehicles/{registrationNo}/latest:
 *   get:
 *     summary: 'Get latest location of a vehicle'
 *     description: null
 *     tags:
 *       - 'Tracking & Location'
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
 *         description: 'Latest location'
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
 *                   $ref: '#/components/schemas/LatestLocation'
 *       '404':
 *         description: 'Vehicle not found, or it has no pings'
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
router.get('/vehicles/:registrationNo/latest', validateRegistrationNoParam, getLatestLocation);

/**
 * @swagger
 * /tracking/vehicles/{registrationNo}/history:
 *   get:
 *     summary: 'Get movement history of a vehicle'
 *     description: '`from` and `to` are required. Oldest first. Not paginated.'
 *     tags:
 *       - 'Tracking & Location'
 *     parameters:
 *       - name: 'registrationNo'
 *         in: 'path'
 *         required: true
 *         description: 'Vehicle registration number (case-insensitive, normalised to upper case)'
 *         schema:
 *           type: 'string'
 *           example: 'NA-1234'
 *       - name: 'from'
 *         in: 'query'
 *         required: true
 *         description: 'Range start (ISO 8601 date-time). Must be supplied together with `to`.'
 *         schema:
 *           type: 'string'
 *           example: '2025-04-25T00:00:00Z'
 *           format: 'date-time'
 *       - name: 'to'
 *         in: 'query'
 *         required: true
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
 *                     vehicleId:
 *                       type: 'integer'
 *                     registrationNo:
 *                       type: 'string'
 *                     from:
 *                       type: 'string'
 *                       format: 'date-time'
 *                     to:
 *                       type: 'string'
 *                       format: 'date-time'
 *                     count:
 *                       type: 'integer'
 *                     history:
 *                       type: 'array'
 *                       items:
 *                         $ref: '#/components/schemas/HistoryPing'
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
router.get('/vehicles/:registrationNo/history', validateRegistrationNoParam, validateDateRangeQuery({ required: true }), getMovementHistory);

module.exports = router;
