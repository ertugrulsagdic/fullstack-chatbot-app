import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './schemas/question.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name)
    private readonly questionModel: Model<Question>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto) {
    const createdQuestion = await this.questionModel.create({
      ...createQuestionDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return createdQuestion;
  }

  async createMany(questions: CreateQuestionDto[]): Promise<Question[]> {
    return this.questionModel.insertMany(questions);
  }

  async count(): Promise<number> {
    try {
      return this.questionModel.countDocuments().exec();
    } catch (error) {
      console.error('Error in QuestionService.count:', error);
      throw error;
    }
  }

  findAll() {
    return this.questionModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    const updatedQuestion = await this.questionModel.findByIdAndUpdate(
      id,
      updateQuestionDto,
      { new: true },
    );
    return updatedQuestion;
  }

  remove(id: number) {
    return this.questionModel.findByIdAndDelete(id).exec();
  }
}
