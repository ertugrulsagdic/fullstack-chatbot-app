import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

@Schema()
export class Question {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  text: string;

  @Prop({ type: Number, required: true })
  index: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: Boolean, default: false, required: true })
  isDynamicallyGenerated: boolean;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
