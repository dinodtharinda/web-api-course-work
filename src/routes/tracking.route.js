const router = require('express').Router();

const { ingestLocationPing, getLatestLocation, getMovementHistory } = require('@/controllers/locations.controller');

router.post('/pings', ingestLocationPing);
router.get('/vehicles/:registrationNo/latest', getLatestLocation);
router.get('/vehicles/:registrationNo/history', getMovementHistory);

module.exports = router;
