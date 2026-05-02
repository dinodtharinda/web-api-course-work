const router = require('express').Router();

const { listProvinces } = require('@/controllers/locations.controller');

/**
 * @swagger
 * /locations/provinces:
 *   get:
 *     summary: List all provinces
 *     description: Retrieve all provinces and their associated districts
 *     tags:
 *       - Locations
 *     responses:
 *       200:
 *         description: Provinces retrieved successfully
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       districts:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/District'
 */
router.get('/provinces', listProvinces);

module.exports = router;
