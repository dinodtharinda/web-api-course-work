require('./src/configs/init.config');

const express = require('express');
const cors = require('cors');

const { appConfig } = require('@/configs/constants.config');
const corsOptions = require('@/configs/cors.config');
const { infoLog, errorLog } = require('@/utils/logger.util');
const routes = require('@/routes');
const { notFoundHandler, globalErrorHandler } = require('@/middlewares/handleErrors.middleware');

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(appConfig.apiPrefix, routes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

(async () => {
  try {
    app.listen(appConfig.port, () => {
      infoLog(`${appConfig.name} running at port: ${appConfig.port}`);
    });
  } catch (err) {
    errorLog('Failed to start server', err);
    process.exit(1);
  }
})();
