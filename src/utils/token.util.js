const jwt = require('jsonwebtoken');

const { authConfig } = require('@/configs/constants.config');

const generateAccessToken = (payload) => {
  return jwt.sign(payload, authConfig.jwtAccessSecret, {
    expiresIn: authConfig.jwtAccessExpiresIn,
  });
};

module.exports = {
  generateAccessToken,
};
