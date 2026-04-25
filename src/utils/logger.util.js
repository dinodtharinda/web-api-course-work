const infoLog = (...args) => {
  console.log(...args);
};

const errorLog = (...args) => {
  console.error(...args);
};

module.exports = {
  infoLog,
  errorLog,
};
