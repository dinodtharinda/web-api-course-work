const router = require('express').Router();

const { listStations } = require('@/controllers/stations.controller');

router.get('/', listStations);

module.exports = router;