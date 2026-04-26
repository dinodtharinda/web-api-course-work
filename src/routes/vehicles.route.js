const router = require('express').Router();

const { createVehicle, listVehicles } = require('@/controllers/vehicles.controller');

router.get('/', listVehicles);
router.post('/', createVehicle);

module.exports = router;