const router = require('express').Router();

const authRoute = require('./auth.route');
const locationsRoute = require('./locations.route');
const stationsRoute = require('./stations.route');
const testRoute = require('./test.route');

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
  });
});

router.use('/test', testRoute);
router.use('/auth', authRoute);
router.use('/locations', locationsRoute);
router.use('/stations', stationsRoute);

module.exports = router;
