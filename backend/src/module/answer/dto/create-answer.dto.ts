import mongoose from 'mongoose';

export class CreateAnswerDto {
  text: string;
  question: mongoose.Types.ObjectId;
  session: mongoose.Types.ObjectId;
}
