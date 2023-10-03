import { WebSocketServer, SubscribeMessage, MessageBody, WebSocketGateway } from '@nestjs/websockets';

import { Server, Socket} from 'socket.io';

@WebSocketGateway({ namespace: 'chat' }) // 기본포트 3000 -> 첫번째 파라미터로 포트도 지정가능.
export class ChatGateway {

  @WebSocketServer() server: Server;

  @SubscribeMessage('message')
  handleMessage(socket: Socket, data: any): void { // message 이벤트 -> data 매개변수에 담김.
    const { message, nickname } = data;
    socket.broadcast.emit('message',`${nickname}: ${message}`);
  }
}

@WebSocketGateway({ namespace: 'room' })
export class RoomGateway{
  rooms = [];

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createRoom')
  handleMessage(@MessageBody() data){
    const { nickname, room } = data;
    this.rooms.push(room);
    this.server.emit('rooms',this.rooms);
  }
}
