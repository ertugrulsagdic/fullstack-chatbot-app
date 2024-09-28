import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Answer } from '../../answer/schemas/answer.schema';

export type UserSessionDocument = HydratedDocument<UserSession>;

@Schema()
export class UserSession {
  @Prop({ required: true })
  name: string;

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
