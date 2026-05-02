const router = require('express').Router();

const { listStations, getStationTrackingHistory } = require('@/controllers/stations.controller');
const { validateStationIdParam, validateDateRangeQuery } = require('@/middlewares/validate.middleware');

/**
 * @swagger
 * /stations:
 *   get:
 *     summary: List all police stations
 *     description: Retrieve all registered police stations with their district associations
 *     tags:
 *       - Police Stations
 *     parameters:
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
 *       - name: district_id
 *         in: query
 *         description: Filter by district ID (optional)
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Police stations retrieved successfully
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
 *                   type: object
 *                   properties:
 *                     stations:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/PoliceStation'
 *                     pagination:
 *                       type: object
 */
router.get('/', listStations);

/**
 * @swagger
 * /stations/{stationId}/tracking/history:
 *   get:
 *     summary: Get tracking history for a police station
 *     description: Retrieve location history for all tuk-tuks operating within a police station's jurisdiction
 *     tags:
 *       - Police Stations
 *     parameters:
 *       - name: stationId
 *         in: path
 *         required: true
 *         description: Police station ID
 *         schema:
 *           type: integer
 *       - name: start_date
 *         in: query
 *         description: Start date for history range (optional)
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-04-25
 *       - name: end_date
 *         in: query
 *         description: End date for history range (optional)
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
 *         description: Station tracking history retrieved successfully
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
 *                   type: object
 *                   properties:
 *                     station:
 *                       $ref: '#/components/schemas/PoliceStation'
 *                     tracking_data:
 *                       type: array
 *       404:
 *         description: Police station not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:stationId/tracking/history', validateStationIdParam, validateDateRangeQuery(), getStationTrackingHistory);

module.exports = router;