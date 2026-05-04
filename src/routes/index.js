const router = require('express').Router();

const authRoute = require('./auth.route');
const locationsRoute = require('./locations.route');
const stationsRoute = require('./stations.route');
const vehiclesRoute = require('./vehicles.route');
const devicesRoute = require('./devices.route');
const usersRoute = require('./users.route');
const trackingRoute = require('./tracking.route');
const testRoute = require('./test.route');
const { sendSuccess } = require('@/utils/response.util');

router.get('/health', (req, res) => {
  return sendSuccess(res, 200, 'API is running');
});

router.use('/test', testRoute);
router.use('/auth', authRoute);
router.use('/locations', locationsRoute);
router.use('/stations', stationsRoute);
router.use('/vehicles', vehiclesRoute);
router.use('/devices', devicesRoute);
router.use('/users', usersRoute);
router.use('/tracking', trackingRoute);

module.exports = router;
