import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Answer } from '../../answer/schemas/answer.schema';
import { Question } from 'src/module/question/schemas/question.schema';

export type UserSessionDocument = HydratedDocument<UserSession>;

@Schema()
export class UserSession {
  _id: mongoose.Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  clientId: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }])
  questions: Question[];

  @Prop({ type: Number, default: 0 })
  currentQuestionIndex: number;

  @Prop({ type: Date, default: Date.now })
  sessionStart: Date;

  @Prop({ type: Date })
  sessionEnd: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }])
  answers: Answer[];
}

export const UserSessionSchema = SchemaFactory.createForClass(UserSession);
