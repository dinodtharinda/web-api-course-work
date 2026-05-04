const router = require('express').Router();

const { listProvinces, listDistricts, listProvinceDistricts } = require('@/controllers/locations.controller');
const { validateIdParam } = require('@/middlewares/validate.middleware');

/**
 * @swagger
 * /locations/provinces:
 *   get:
 *     summary: 'List provinces'
 *     description: 'Paginated. Pass `includeDistricts=true` to embed districts.'
 *     tags:
 *       - 'Locations'
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
 *         description: 'Partial match on province name'
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
 *       - name: 'includeDistricts'
 *         in: 'query'
 *         required: false
 *         description: 'Embed each province''s districts'
 *         schema:
 *           type: 'boolean'
 *           default: false
 *     responses:
 *       '200':
 *         description: 'Provinces retrieved'
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
 *                     $ref: '#/components/schemas/Province'
 *                 meta:
 *                   $ref: '#/components/schemas/ListMeta'
 */
router.get('/provinces', listProvinces);

/**
 * @swagger
 * /locations/districts:
 *   get:
 *     summary: 'List districts'
 *     description: 'Paginated list of all districts, optionally filtered by province.'
 *     tags:
 *       - 'Locations'
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
 *         description: 'Partial match on district name'
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
 *       - name: 'provinceId'
 *         in: 'query'
 *         required: false
 *         description: 'Only districts of this province'
 *         schema:
 *           type: 'integer'
 *           example: 1
 *     responses:
 *       '200':
 *         description: 'Districts retrieved'
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
 *                     $ref: '#/components/schemas/District'
 *                 meta:
 *                   $ref: '#/components/schemas/ListMeta'
 */
router.get('/districts', listDistricts);

/**
 * @swagger
 * /locations/provinces/{provinceId}/districts:
 *   get:
 *     summary: 'List districts of a province'
 *     description: 'Paginated.'
 *     tags:
 *       - 'Locations'
 *     parameters:
 *       - name: 'provinceId'
 *         in: 'path'
 *         required: true
 *         description: 'Province ID'
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
 *         description: 'Partial match on district name'
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
 *         description: 'Districts retrieved'
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
 *                     $ref: '#/components/schemas/District'
 *                 meta:
 *                   $ref: '#/components/schemas/ListMeta'
 *       '404':
 *         description: 'Province not found'
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
router.get('/provinces/:provinceId/districts', validateIdParam('provinceId'), listProvinceDistricts);

module.exports = router;
