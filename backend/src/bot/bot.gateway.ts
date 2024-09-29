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
import { CreateUserSessionDto } from 'src/module/user-session/dto/create-user-session.dto';
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

  async handleConnection(client: any) {
    const { id } = client.handshake.query;

    let session = await this.userSessionService.findOne(id);

    if (session) {
      this.userSessionService.continueSession(session._id);
      return;
    }

    const createSessionDto: CreateUserSessionDto = {
      clientId: client.id,
    };

    try {
      session = await this.userSessionService.startSession(createSessionDto);
    } catch (error) {
      console.error(
        `Failed to start session for client id: ${client.id}`,
        error,
      );
    }
    // reply with the session
    client.emit('session', session._id);
  }

  async handleDisconnect(client: any) {
    const { id } = client.handshake.query;

    try {
      let session = await this.userSessionService.findOne(id);

      if (!session) {
        session = await this.userSessionService.findOneByClientId(client.id);
      }

      if (session) {
        await this.userSessionService.endSession(session._id);
      }
    } catch (error) {
      console.error(`Failed to end session for client id: ${client.id}`, error);
    }
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
