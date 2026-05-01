const router = require('express').Router();

const { ingestLocationPing, getLatestLocation, getMovementHistory, getFilteredHistory } = require('@/controllers/locations.controller');

router.post('/pings', ingestLocationPing);
router.get('/history', getFilteredHistory);
router.get('/vehicles/:registrationNo/latest', getLatestLocation);
router.get('/vehicles/:registrationNo/history', getMovementHistory);

module.exports = router;
