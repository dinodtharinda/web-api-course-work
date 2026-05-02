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
 *     summary: Ingest location ping
 *     description: Accept a new GPS location update from a tuk-tuk or tracking device
 *     tags:
 *       - Tracking & Location
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - registration_no
 *               - device_id
 *               - latitude
 *               - longitude
 *               - timestamp
 *             properties:
 *               registration_no:
 *                 type: string
 *                 example: NA-1234
 *               device_id:
 *                 type: string
 *                 example: device-uuid-12345
 *               latitude:
 *                 type: number
 *                 format: double
 *                 example: 6.9271
 *               longitude:
 *                 type: number
 *                 format: double
 *                 example: 80.7789
 *               accuracy:
 *                 type: number
 *                 example: 5.5
 *               speed:
 *                 type: number
 *                 example: 25.3
 *               heading:
 *                 type: number
 *                 example: 180.0
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-05-02T10:30:00Z
 *     responses:
 *       201:
 *         description: Location ping ingested successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid ping data
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
 *     summary: Get filtered tracking history
 *     description: Retrieve location history with optional province and district filtering
 *     tags:
 *       - Tracking & Location
 *     parameters:
 *       - name: province_id
 *         in: query
 *         description: Filter by province ID (optional)
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: district_id
 *         in: query
 *         description: Filter by district ID (optional)
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Filtered history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid filter parameters
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
 *     summary: Get latest location
 *     description: Retrieve the most recent location ping for a specific tuk-tuk
 *     tags:
 *       - Tracking & Location
 *     parameters:
 *       - name: registrationNo
 *         in: path
 *         required: true
 *         description: Vehicle registration number
 *         schema:
 *           type: string
 *           example: NA-1234
 *     responses:
 *       200:
 *         description: Latest location retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statusCode:
 *                   type: integer
 *                 data:
 *                   $ref: '#/components/schemas/LocationPing'
 *       404:
 *         description: Vehicle or location not found
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
 *     summary: Get movement history for a vehicle
 *     description: Retrieve location history for a specific tuk-tuk within a date range
 *     tags:
 *       - Tracking & Location
 *     parameters:
 *       - name: registrationNo
 *         in: path
 *         required: true
 *         description: Vehicle registration number
 *         schema:
 *           type: string
 *           example: NA-1234
 *       - name: start_date
 *         in: query
 *         required: true
 *         description: Start date for history range
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-04-25
 *       - name: end_date
 *         in: query
 *         required: true
 *         description: End date for history range
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-05-02
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Vehicle history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statusCode:
 *                   type: integer
 *                 data:
 *                   $ref: '#/components/schemas/TrackingHistory'
 *       404:
 *         description: Vehicle or data not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/vehicles/:registrationNo/history', validateRegistrationNoParam, validateDateRangeQuery({ required: true }), getMovementHistory);

module.exports = router;
