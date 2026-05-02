require('./src/configs/init.config');

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const { appConfig } = require('@/configs/constants.config');
const { connectToDatabase } = require('@/configs/database.config');
const corsOptions = require('@/configs/cors.config');
const { infoLog, errorLog } = require('@/utils/logger.util');
const swaggerSpecs = require('@/configs/swagger.config');
const routes = require('@/routes');
const { auditRequests } = require('@/middlewares/audit.middleware');
const { notFoundHandler, globalErrorHandler } = require('@/middlewares/handleErrors.middleware');

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(auditRequests);

app.use(`${appConfig.apiPrefix}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use(appConfig.apiPrefix, routes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

(async () => {
  try {
    await connectToDatabase();

    app.listen(appConfig.port, () => {
      infoLog(`${appConfig.name} running at port: ${appConfig.port}`);
    });
  } catch (err) {
    errorLog('Failed to start server', err);
    process.exit(1);
  }
})();

