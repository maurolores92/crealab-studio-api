import { Server } from './src/server';
import express from 'express';
import * as config from './src/core/configurations';
import helmet from 'helmet';
import path from 'path';

(globalThis as any).appRoot = path.resolve(__dirname);

const appExpress = express();
appExpress.disable('x-powered-by');

appExpress.use(helmet.hidePoweredBy());
const { port } = config.app;

const server = new Server(appExpress);

server.start(port);
server.initSocket();
