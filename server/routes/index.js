import config from '../config/index.js';
import { Controller } from '../controllers/index.js';
import { logger } from '../libs/pino.js';

// inicialize
const controller = new Controller();

// routes
async function routes(request, response) {
  const { method, url } = request;

  /* Page Home */
  if (method === 'GET' && url === '/') {
    response.writeHead(302, {
      Location: config.location.home,
    });

    return response.end();
  }

  if (method === 'GET' && url === '/home') {
    const { stream } = await controller.getFileStream(config.pages.homeHTML);

    return stream.pipe(response);
  }

  /* Page Controller */
  if (method === 'GET' && url === '/controller') {
    const { stream } = await controller.getFileStream(
      config.pages.controllerHTMl
    );

    return stream.pipe(response);
  }

  /* Files (css, assets) */
  if (method === 'GET') {
    const { stream, type } = await controller.getFileStream(url);
    const contentType = config.constants.CONTENT_TYPE[type];

    if (contentType) {
      response.writeHead(200, {
        'Content-Type': contentType,
      });
    }

    return stream.pipe(response);
  }

  /* 404 */
  response.writeHead(404);
  return response.end;
}

/* error */
function handleError(error, response) {
  if (error.message.includes('ENOENT')) {
    logger.warn(`assets not found: ${error.stack}`);
    response.writeHead(404);
    return response.end();
  }

  logger.error(`could error on API: ${error.stack}`);
  response.writeHead(500);
  return response.end();
}

function handle(request, response) {
  return routes(request, response).catch((err) => handleError(err, response));
}

export { handle };
