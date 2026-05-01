const { auditLog } = require('@/utils/logger.util');

const auditRequests = (req, res, next) => {
  const startedAt = Date.now();
  const shouldAudit = !['GET', 'HEAD'].includes(req.method);

  if (!shouldAudit) {
    return next();
  }

  res.on('finish', () => {
    auditLog('request', {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });

  return next();
};

module.exports = {
  auditRequests,
};