const router = require('express').Router();

const { register, login, me, adminGuardCheck } = require('@/controllers/auth.controller');
const { authenticate, authorizeRoles } = require('@/middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, me);
router.get('/admin-check', authenticate, authorizeRoles('admin'), adminGuardCheck);

module.exports = router;
