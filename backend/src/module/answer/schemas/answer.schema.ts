import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Question } from '../../question/schemas/question.schema';

export type AnswerDocument = HydratedDocument<Answer>;

@Schema()
export class Answer {
  @Prop()
  text: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Question' })
  question: Question;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
