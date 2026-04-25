const ping = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'pong',
  });
};

module.exports = {
  ping,
};
