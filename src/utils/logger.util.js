const infoLog = (...args) => {
  console.log(...args);
};

const errorLog = (...args) => {
  console.error(...args);
};

const auditLog = (event, details = {}) => {
  const payload = Object.keys(details).length > 0 ? ` ${JSON.stringify(details)}` : '';
  console.log(`[AUDIT] ${event}${payload}`);
};

module.exports = {
  infoLog,
  errorLog,
  auditLog,
};
