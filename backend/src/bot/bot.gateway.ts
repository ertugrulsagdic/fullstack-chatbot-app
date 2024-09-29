import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { AnswerService } from 'src/module/answer/answer.service';
import { QuestionService } from 'src/module/question/question.service';
import { UserSessionService } from 'src/module/user-session/user-session.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class BotGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly questionService: QuestionService,
    private readonly answerService: AnswerService,
    private readonly userSessionService: UserSessionService,
  ) {}

  afterInit() {
    console.log('Initialized');
  }

  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.server.sockets;
    console.log(args);
    console.log(`Client id: ${client.id} connected`);
    console.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: any) {
    console.log(`Cliend id:${client.id} disconnected`);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, data: any) {
    console.log(`Message received from client id: ${client.id}`);
    console.debug(`Payload: ${data}`);
    return {
      event: 'reply',
      data: 'Wrong data that will make the test fail',
    };
  }
}
