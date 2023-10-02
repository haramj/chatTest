import { WebSocketServer, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

import { Server, Socket} from 'socket.io';

@WebSocketGateway() // 기본포트 3000 -> 첫번째 파라미터로 포트도 지정가능.
export class ChatGateway {

  @WebSocketServer() server: Server;

  @SubscribeMessage('message')
  handleMessage(socket: Socket, data: any): void { // message 이벤트 -> data 매개변수에 담김.
    this.server.emit('message',`client-${socket.id.substring(0,4)} : ${data}`,); // client 전체에 메시지 보냄. socket.id -> 20자 무작위 문자열

  }
}
