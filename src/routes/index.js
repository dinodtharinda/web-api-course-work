const router = require('express').Router();

const testRoute = require('./test.route');

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
  });
});

router.use('/test', testRoute);

module.exports = router;
