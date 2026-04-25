const { sequelize } = require('@/models');
const { infoLog, errorLog } = require('@/utils/logger.util');

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    infoLog('SQL database connection established');
  } catch (err) {
    errorLog('Unable to connect to SQL database', err);
    throw err;
  }
};

module.exports = {
  connectToDatabase,
};
