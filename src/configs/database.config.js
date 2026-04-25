const { sequelize } = require('@/models');
const { infoLog, errorLog } = require('@/utils/logger.util');

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();

    if (process.env.DB_SYNC === 'true') {
      await sequelize.sync();
    }

    infoLog('SQL database connection established');
  } catch (err) {
    errorLog('Unable to connect to SQL database', err);
    throw err;
  }
};

module.exports = {
  connectToDatabase,
};
