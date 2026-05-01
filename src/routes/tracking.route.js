const router = require('express').Router();

const { ingestLocationPing, getLatestLocation, getMovementHistory, getFilteredHistory } = require('@/controllers/locations.controller');
const {
	validateRegistrationNoParam,
	validateTrackingPing,
	validateDateRangeQuery,
	validateProvinceDistrictFilterQuery,
} = require('@/middlewares/validate.middleware');

router.post('/pings', validateTrackingPing, ingestLocationPing);
router.get('/history', validateProvinceDistrictFilterQuery, getFilteredHistory);
router.get('/vehicles/:registrationNo/latest', validateRegistrationNoParam, getLatestLocation);
router.get('/vehicles/:registrationNo/history', validateRegistrationNoParam, validateDateRangeQuery({ required: true }), getMovementHistory);

module.exports = router;
