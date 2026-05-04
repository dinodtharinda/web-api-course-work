const router = require('express').Router();

const { listProvinces, listDistricts, listProvinceDistricts } = require('@/controllers/locations.controller');
const { validateIdParam } = require('@/middlewares/validate.middleware');

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

/**
 * @swagger
 * /locations/districts:
 *   get:
 *     summary: List districts
 *     tags:
 *       - Locations
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
 *       - name: provinceId
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/districts', listDistricts);

/**
 * @swagger
 * /locations/provinces/{provinceId}/districts:
 *   get:
 *     summary: List districts of a province
 *     tags:
 *       - Locations
 *     parameters:
 *       - name: provinceId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
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
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Error
 */
router.get('/provinces/:provinceId/districts', validateIdParam('provinceId'), listProvinceDistricts);

module.exports = router;
