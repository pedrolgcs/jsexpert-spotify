import { createServer } from 'http';
import { handle } from './routes/index.js';

export default createServer(handle);
