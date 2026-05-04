const { sendError } = require('@/utils/response.util');

const notFoundHandler = (req, res) => {
  return sendError(res, 404, 'Route not found', undefined, {
    path: req.originalUrl,
    method: req.method,
  });
};

const globalErrorHandler = (err, req, res, next) => {
  if (err.name === 'SequelizeUniqueConstraintError') {
    return sendError(res, 409, 'Duplicate value', err.errors?.map((e) => e.message), {
      path: req.originalUrl,
      method: req.method,
    });
  }

  const statusCode = err.statusCode || 500;

  return sendError(res, statusCode, err.message || 'Internal server error', err.errors, {
    path: req.originalUrl,
    method: req.method,
  });
};

module.exports = {
  notFoundHandler,
  globalErrorHandler,
};
