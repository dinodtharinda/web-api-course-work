require('dotenv').config({ override: true });
require('module-alias/register');

const express = require('express');
const cors = require('cors');

const corsOptions = require('@/configs/cors.config');
const { infoLog, errorLog } = require('@/utils/logger.util');
const routes = require('@/routes');
const { notFoundHandler, globalErrorHandler } = require('@/middlewares/handleErrors.middleware');

const PORT = process.env.APP_PORT || 3000;

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

(async () => {
  try {
    app.listen(PORT, () => {
      infoLog(`Server running at port: ${PORT}`);
    });
  } catch (err) {
    errorLog('Failed to start server', err);
    process.exit(1);
  }
})();
