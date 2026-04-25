const appConfig = {
  name: process.env.APP_NAME || 'web-api-course-work',
  port: Number(process.env.APP_PORT || 3000),
  env: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api',
};

module.exports = {
  appConfig,
};
