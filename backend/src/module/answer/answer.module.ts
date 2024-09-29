import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
// import { AnswerController } from './answer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Answer, AnswerSchema } from './schemas/answer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Answer.name, schema: AnswerSchema }]),
  ],
  // controllers: [AnswerController],
  providers: [AnswerService],
})
export class AnswerModule {}
