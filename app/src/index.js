'use strict';

require('dotenv').config();

const app = require('./app');
const { connectDB } = require('./infrastructure/database/connection');
const logger = require('./infrastructure/logger');

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`User Management Service running on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
}

bootstrap();
