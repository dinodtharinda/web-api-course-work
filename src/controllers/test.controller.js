const { sendSuccess } = require('@/utils/response.util');

const ping = (req, res) => {
  return sendSuccess(res, 200, 'pong');
};

module.exports = {
  ping,
};
