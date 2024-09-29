import { Module } from '@nestjs/common';
import { BotGateway } from './bot.gateway';
import { QuestionModule } from 'src/module/question/question.module';
import { AnswerModule } from 'src/module/answer/answer.module';
import { UserSessionModule } from 'src/module/user-session/user-session.module';

@Module({
  imports: [QuestionModule, AnswerModule, UserSessionModule],
  providers: [BotGateway],
  exports: [BotGateway],
})
export class BotModule {}
