const router = require('express').Router();

const { createVehicle, listVehicles, listVehiclePings } = require('@/controllers/vehicles.controller');

router.get('/', listVehicles);
router.get('/:registrationNo/pings', listVehiclePings);
router.post('/', createVehicle);

module.exports = router;