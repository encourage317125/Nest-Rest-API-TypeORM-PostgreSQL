import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as WebSocket from "ws"
import constants from '../../constants';
import { JWTHelper } from '../../util/jwt';
import { LogFacade } from '../facade';
import { OpentactService } from '../opentact';

@WebSocketGateway({
    handlePreflightRequest: function (req, res) {
        var headers = {
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        };
        res.writeHead(200, headers);
        res.end();
    }
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  oWss: WebSocket;
    
  constructor(
    private opentactService: OpentactService,
    private logFacade: LogFacade,
  ) {
      that = this;

      this.connect();
  }

  connect() {
    that.oWss = new WebSocket(constants.OPENTACT_WSS);

    that.oWss.onopen = that.onWssOpen;
    that.oWss.onclose = that.onWssClose;
    that.oWss.onmessage = that.onWssMessage;
    that.oWss.onerror = that.onWssError;
  }

/////////////////////////
// Opentact wss
  async onWssOpen() {
    console.log('Opentact wss connection established');

    let openTactToken = await that.opentactService.getToken();

    const authRequest = {
      type: 'auth',
      payload: openTactToken.payload.token,
    };

    that.oWss.send(JSON.stringify(authRequest));
  }

  async onWssClose() {
    console.log('Opentact wss connection closed: Reconnecting...');

    setTimeout(() => that.connect(), 1000);
  }

  async onWssMessage(msg: any) {
    let data = JSON.parse(msg.data.toString());

    if (data.type !== 'auth') {
      await that.logFacade.addLog(data);
    }

    that.wss.to(that.room).emit('msgToClient', data);

    if (data.type === 'call_state' && data.payload.direction === 'in' && data.payload.state === 'online') {
      await that.opentactService.executeCallSCA(data.payload.uuid);
    }

    return false;
  }

  onWssError(err: any) {
    console.log({ err })
  }

////////////////////////
// Local wss
  private logger: Logger = new Logger('AppGateway');
  private room: string;

  @WebSocketServer() wss: Server;

  afterInit(server: Socket) {
    that.logger.log('Initialized')
  }

  async handleConnection(client: Socket, ...args: any[]) {
    let token:any = client.handshake.headers['authorization'] && (client.handshake.headers['authorization']).split(' ')[1];
    const user:any = await JWTHelper.verify(token);
    if (!user) {
        client.disconnect(true);
        throw new Error('authentication error')
    }
    that.logger.log(`Client connected: ${client.id}`);
    client.emit('getRoom', user.userUuid);
  }

  handleDisconnect(client: Socket) {
    that.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, message: { message: string, room: string, sender: string }): void {
    that.wss.to(message.room).emit('msgToClient', message.message);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    that.room = room;
    client.join(room);
    client.emit('joinedRoom', `Joined room ${room}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
    client.emit('leftRoom', `Left room ${room}`);
  }
}

let that: AppGateway;