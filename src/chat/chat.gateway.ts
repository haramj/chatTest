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
  // 채팅 게이트웨이 의존성 주입
  constructor(private readonly chatGateway: ChatGateway) {}
  rooms = [];

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessageToRoom(socket: Socket,data){
    const { nickname, room, message } = data;
    console.log(data);
    socket.broadcast.to(room).emit('message', {
      message: `${nickname}: ${message}`,
    });
  }

  @SubscribeMessage('createRoom')
  handleMessage(@MessageBody() data){
    const { nickname, room } = data;
    this.chatGateway.server.emit('notice', {
      message : `${nickname}님이 [${room}] 방을 만들었습니다.`,
    });
    this.rooms.push(room);
    this.server.emit('rooms',this.rooms);
  }
  @SubscribeMessage('joinRoom')
  handleJoinRoom(socket: Socket, data){
    const { nickname, room, toLeaveRoom } = data;
    socket.leave(toLeaveRoom);
      this.chatGateway.server.emit('notice', {
        message: `${nickname}님이 [${room}] 방에 입장했습니다. `,
      });
    socket.join(room);
  }
}
