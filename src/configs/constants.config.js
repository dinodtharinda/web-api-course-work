const appConfig = {
  name: process.env.APP_NAME || 'web-api-course-work',
  port: Number(process.env.APP_PORT || 3000),
  env: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api',
};

const authConfig = {
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1h',
};

module.exports = {
  appConfig,
  authConfig,
};
