const router = require('express').Router();

const { listStations, getStationTrackingHistory } = require('@/controllers/stations.controller');
const { validateStationIdParam, validateDateRangeQuery } = require('@/middlewares/validate.middleware');

router.get('/', listStations);
router.get('/:stationId/tracking/history', validateStationIdParam, validateDateRangeQuery(), getStationTrackingHistory);

module.exports = router;