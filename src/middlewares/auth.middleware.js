const jwt = require('jsonwebtoken');

const { authConfig } = require('@/configs/constants.config');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [tokenType, token] = authHeader.split(' ');

  if (tokenType !== 'Bearer' || !token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  try {
    const payload = jwt.verify(token, authConfig.jwtAccessSecret);
    req.auth = payload;
    return next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.auth || !allowedRoles.includes(req.auth.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden',
      });
    }

    return next();
  };
};

module.exports = {
  authenticate,
  authorizeRoles,
};
