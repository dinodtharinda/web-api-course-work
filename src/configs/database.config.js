const { sequelize } = require('@/models');
const { infoLog, errorLog } = require('@/utils/logger.util');
const { seedMasterData } = require('@/seeders/master-data.seeder');

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();

    if (process.env.DB_SYNC !== 'false') {
      await sequelize.sync();
    }

    if (process.env.DB_SEED_MASTER_DATA !== 'false') {
      await seedMasterData();
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
