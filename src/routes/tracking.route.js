const router = require('express').Router();

const { ingestLocationPing } = require('@/controllers/locations.controller');

router.post('/pings', ingestLocationPing);

module.exports = router;
