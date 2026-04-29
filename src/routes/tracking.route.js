const router = require('express').Router();

const { ingestLocationPing, getLatestLocation } = require('@/controllers/locations.controller');

router.post('/pings', ingestLocationPing);
router.get('/vehicles/:registrationNo/latest', getLatestLocation);

module.exports = router;
