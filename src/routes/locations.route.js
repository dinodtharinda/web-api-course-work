const router = require('express').Router();

const { listProvinces } = require('@/controllers/locations.controller');

router.get('/provinces', listProvinces);

module.exports = router;
