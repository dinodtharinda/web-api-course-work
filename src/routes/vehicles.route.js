const router = require('express').Router();

const { createVehicle, listVehicles, listVehiclePings } = require('@/controllers/vehicles.controller');

/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: List all vehicles
 *     description: Retrieve a paginated list of all registered tuk-tuks
 *     tags:
 *       - Vehicles
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
 *       - name: search
 *         in: query
 *         description: Search by registration number or owner name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehicles retrieved successfully
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
 *                     vehicles:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Vehicle'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         pages:
 *                           type: integer
 */
router.get('/', listVehicles);

/**
 * @swagger
 * /vehicles/{registrationNo}/pings:
 *   get:
 *     summary: List pings for a vehicle
 *     description: Retrieve location pings for a specific tuk-tuk
 *     tags:
 *       - Vehicles
 *     parameters:
 *       - name: registrationNo
 *         in: path
 *         required: true
 *         description: Vehicle registration number
 *         schema:
 *           type: string
 *           example: NA-1234
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
 *         description: Vehicle pings retrieved successfully
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
 *                     pings:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/LocationPing'
 *                     pagination:
 *                       type: object
 *       404:
 *         description: Vehicle not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:registrationNo/pings', listVehiclePings);

/**
 * @swagger
 * /vehicles:
 *   post:
 *     summary: Create a new vehicle
 *     description: Register a new tuk-tuk in the system (admin-only)
 *     tags:
 *       - Vehicles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - registration_no
 *               - owner_name
 *               - owner_contact
 *             properties:
 *               registration_no:
 *                 type: string
 *                 example: NA-1234
 *               owner_name:
 *                 type: string
 *                 example: John Doe
 *               owner_contact:
 *                 type: string
 *                 example: +94701234567
 *               description:
 *                 type: string
 *                 example: Yellow tuk-tuk with good condition
 *     responses:
 *       201:
 *         description: Vehicle created successfully
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
 *                   $ref: '#/components/schemas/Vehicle'
 *       400:
 *         description: Invalid vehicle data or duplicate registration
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', createVehicle);

module.exports = router;