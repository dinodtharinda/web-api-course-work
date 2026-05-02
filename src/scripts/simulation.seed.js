require('module-alias/register');

const { connectToDatabase } = require('@/configs/database.config');
const { sequelize } = require('@/models');
const { seedSimulationHistory } = require('@/seeders/simulation-history.seeder');
const { errorLog, infoLog } = require('@/utils/logger.util');

const run = async () => {
  try {
    await connectToDatabase();
    await seedSimulationHistory();
    infoLog('Simulation seed completed');
  } catch (err) {
    errorLog('Simulation seed failed', err);
    process.exitCode = 1;
  } finally {
    await sequelize.close().catch(() => {});
  }
};

run();