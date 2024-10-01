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
import { CreateAnswerDto } from 'src/module/answer/dto/create-answer.dto';
import { QuestionService } from 'src/module/question/question.service';
import { CreateUserSessionDto } from 'src/module/user-session/dto/create-user-session.dto';
import { UpdateUserSessionDto } from 'src/module/user-session/dto/update-user-session.dto';
import { UserSession } from 'src/module/user-session/schemas/user-session.schema';
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
    const { id } = client.handshake.query;

    let session = await this.userSessionService.findOne(id);

    if (!session) {
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
    }

    client.emit('session', session._id);

    this.userSessionService.continueSession(session._id);

    session = await this.userSessionService.findUserSessionDetails(session._id);

    client.emit('sessionData', {
      success: true,
      data: session,
    });

    // const count = await this.questionService.count();

    await this.handleNextQuestion(client, session);
    // if (session.currentQuestionIndex < count) {
    // } else {
    //   client.emit('sessionEnd', {
    //     success: true,
    //     data: {
    //       text: "That's all! Thank you for your answers!",
    //     },
    //   });
    // }
  }

  async handleNextQuestion(client: any, session: UserSession) {
    const nextQuestion = await this.questionService.findQuestionsByIndex(
      session.currentQuestionIndex,
    );

    console.log('nextQuestion', nextQuestion);

    if (nextQuestion) {
      // check questions and update the index===1 replace with {name} with session.name
      if (nextQuestion.index == 1 && nextQuestion.text.includes('{name}')) {
        nextQuestion.text = nextQuestion.text.replace('{name}', session.name);
      }

      client.emit('nextQuestion', {
        success: true,
        data: nextQuestion,
      });
    } else {
      console.log('No more questions');
      client.emit('sessionEnd', {
        success: true,
        data: {
          text: "That's all! Thank you for your answers!",
        },
      });
    }
  }

  async handleDisconnect(client: any) {
    const { id } = client.handshake.query;

    if (!id) {
      return;
    }

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

      const question = await this.questionService.findQuestionsByIndex(
        session.currentQuestionIndex,
      );

      console.log('question', question);

      this.handleQuestion(client, session, question);

      session = await this.userSessionService.update(
        sessionId,
        updateSessionDto,
      );

      const nextQuestion = await this.questionService.findQuestionsByIndex(
        session.currentQuestionIndex + 1,
      );

      console.log('next', nextQuestion);

      this.handleQuestion(client, session, nextQuestion);

      return { success: true, data: name };
    } else {
      return {
        success: false,
        data: 'Session not found',
      };
    }
  }

  async handleQuestion(client: any, session: any, question: any) {
    session = await this.userSessionService.addQuestion(
      session._id,
      question._id,
    );

    await this.handleNextQuestion(client, session);
  }

  @SubscribeMessage('sendAnswer')
  async handleAnswer(client: any, data: any) {
    const { sessionId, answer } = data;

    const session = await this.userSessionService.findOne(sessionId);

    if (session) {
      const question = await this.questionService.findQuestionsByIndex(
        session.currentQuestionIndex,
      );

      const createAnswerDto: CreateAnswerDto = {
        text: answer,
        question: question._id,
        session: session._id,
      };

      const createdAnswer = await this.answerService.create(createAnswerDto);

      this.handleQuestion(client, session, question);

      // this.handleNextQuestion(client, session, );

      return { success: true, data: createdAnswer };
    }
  }
}
