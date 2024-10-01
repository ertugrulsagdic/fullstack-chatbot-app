import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserSessionDocument = HydratedDocument<UserSession>;

@Schema()
export class UserSession {
  _id: mongoose.Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  clientId: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }])
  questions: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: Number, default: 0 })
  currentQuestionIndex: number;

  @Prop({ type: Date, default: Date.now })
  sessionStart: Date;

  @Prop({ type: Date })
  sessionEnd: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const UserSessionSchema = SchemaFactory.createForClass(UserSession);
