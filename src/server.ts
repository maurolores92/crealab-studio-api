import path from 'path';
import express, { Express, NextFunction, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import expressFileUpload from 'express-fileupload';
import { Server as HTTPServer } from 'http';
import { Server as SocketServer } from 'socket.io';

import { errorResponseHandler } from '@src/core/middleware/error-handler.middleware';
import apiRouter from './routes/apiRouter';
import health from './routes/health';
import { getWsOptions } from './core/configurations/websockets';
import { sequelize } from './core/configurations';

import seedersService from './modules/seeders/seeders.service';


const CORS_SOCKET = {
  cors : { 
    origin: '*', 
    methods: ["GET", "POST"],
    transports: ['websocket', 'polling'], 
  },
  allowEIO3: true
};

export class Server {
  private app: Express;
  private httpServer: any;
  public IO : any;
  public whatsapp: any;

  constructor(app: Express) {
    this.httpServer = new HTTPServer(app);
    const io = new SocketServer(this.httpServer, CORS_SOCKET);
    this.IO = io;
    this.app = app;
    
    // sentryConfig(app);
    this.app.use(express.static(path.resolve('./') + '/public'));
   

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    app.set('view engine', 'ejs');
    app.set('views', path.join(path.resolve('./'), 'templates/'));

    this.app.use(cors());
    this.app.use(expressFileUpload());
    app.use(function(req: any,res: Response, next: NextFunction){
      req.io = io;
     
      next();
    });
    
    this.app.use(health);
    this.app.use('/api', apiRouter);
    
    this.app.get('*', (req, res) => {
      res.sendFile(path.resolve('./') + '/public/index.html');
    });
    
    this.app.use(errorResponseHandler);

  }

  public initSocket = (): void => {
    this.IO.on('connection', (socket: any)=> {
      getWsOptions().forEach((option: string) => {
        socket.join(option);
      });
      
      socket.on('disconnect',(reason: any)=>{
        console.info(reason);
      });
    });
  };

  public async start(port: number): Promise<void> {
    const force = true;
    await sequelize.sync({ force, alter: true })
   
    console.log('Database forced:', force);
    if(force) {
      await seedersService.seed().then(() => console.info('Seeders executed'));
    }
   
    this.httpServer.listen(port, () =>
      console.info(`Server listening on port ${port}!`)
    );
  }
}
