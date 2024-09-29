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
import { UpdateUserSessionDto } from 'src/module/user-session/dto/update-user-session.dto';
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

  afterInit() {}

  async handleConnection(client: any) {
    console.log(
      `Number of connected clients: ${this.server.engine.clientsCount}`,
    );

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

  @SubscribeMessage('updateName')
  async handleUpdateName(client: any, data: any) {
    const { sessionId, name } = data;

    let session = await this.userSessionService.findOne(sessionId);

    if (session) {
      const updateSessionDto: UpdateUserSessionDto = {
        name,
      };

      session = await this.userSessionService.update(
        sessionId,
        updateSessionDto,
      );

      client.emit('nameUpdated', { success: true, data: name });
    } else {
      return {
        success: false,
        data: 'Session not found',
      };
    }
  }
}
