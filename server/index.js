import config from './config/index.js';
import { logger } from './libs/pino.js';
import server from './server.js';

server
  .listen(config.port)
  .on('listening', () => logger.info(`Listening on port ${config.port}`));
