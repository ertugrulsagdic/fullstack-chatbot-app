import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { Model } from 'mongoose';
import { Answer } from './schemas/answer.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AnswerService {
  constructor(
    @InjectModel(Answer.name)
    private readonly answerModel: Model<Answer>,
  ) {}

  async create(createAnswerDto: CreateAnswerDto) {
    const createdAnswer = await this.answerModel.create({
      ...createAnswerDto,
      createdAt: new Date(),
    });
    return createdAnswer;
  }

  findAll() {
    return this.answerModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} answer`;
  }

  update(id: number, updateAnswerDto: UpdateAnswerDto) {
    return `This action updates a #${id} answer`;
  }

  remove(id: number) {
    return `This action removes a #${id} answer`;
  }
}
