const sendSuccess = (res, statusCode, message, data = undefined, meta = undefined) => {
  const payload = {
    success: true,
    message,
  };

  if (data !== undefined) {
    payload.data = data;
  }

  if (meta !== undefined) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
};

const sendError = (res, statusCode, message, details = undefined, extra = undefined) => {
  const payload = {
    success: false,
    message,
  };

  if (details !== undefined) {
    payload.errors = details;
  }

  if (extra !== undefined) {
    payload.meta = extra;
  }

  return res.status(statusCode).json(payload);
};

module.exports = {
  sendSuccess,
  sendError,
};