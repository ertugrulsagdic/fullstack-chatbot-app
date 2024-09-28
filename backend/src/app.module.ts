import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionModule } from './module/question/question.module';
import { AnswerModule } from './module/answer/answer.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSessionModule } from './module/user-session/user-session.module';
import 'dotenv/config';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
    QuestionModule,
    AnswerModule,
    UserSessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
