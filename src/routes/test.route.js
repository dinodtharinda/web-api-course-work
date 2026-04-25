const router = require('express').Router();

const { ping } = require('@/controllers/test.controller');

router.get('/ping', ping);

module.exports = router;
