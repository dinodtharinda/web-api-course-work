const router = require('express').Router();

const { listStations, getStationTrackingHistory } = require('@/controllers/stations.controller');

router.get('/', listStations);
router.get('/:stationId/tracking/history', getStationTrackingHistory);

module.exports = router;