import { WebsocketOptions } from '@src/core/configurations/websockets';
import { Server as SocketServer } from 'socket.io';

export abstract class WebsocketService {
  private connectionString: string;
  constructor(readonly connection: WebsocketOptions, readonly io: SocketServer){
    this.connectionString = WebsocketOptions[connection];
  }

  public sentToEvent = (event: string, data: any): void => {
    this.io.to(this.connectionString).emit(event, data);
  };
  
}