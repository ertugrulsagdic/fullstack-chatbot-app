import { Injectable } from '@nestjs/common';
import { CreateUserSessionDto } from './dto/create-user-session.dto';
import { UpdateUserSessionDto } from './dto/update-user-session.dto';
import { UserSession } from './schemas/user-session.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { QuestionService } from '../question/question.service';

@Injectable()
export class UserSessionService {
  constructor(
    @InjectModel(UserSession.name)
    private readonly userSessionModel: Model<UserSession>,
    private readonly questionService: QuestionService,
  ) {}

  async startSession(
    createUserSessionDto: CreateUserSessionDto,
  ): Promise<UserSession> {
    const createdUserSession =
      await this.userSessionModel.create(createUserSessionDto);
    return createdUserSession;
  }

  async endSession(id: mongoose.Types.ObjectId): Promise<UserSession> {
    const updatedUserSession = await this.userSessionModel.findByIdAndUpdate(
      id,
      { updatedAt: new Date(), sessionEnd: new Date() },
      { new: true },
    );
    return updatedUserSession;
  }

  async updateClientId(
    id: mongoose.Types.ObjectId,
    clientId: string,
  ): Promise<UserSession> {
    const updatedUserSession = await this.userSessionModel.findByIdAndUpdate(
      id,
      { clientId },
      { new: true },
    );
    return updatedUserSession;
  }

  async continueSession(id: mongoose.Types.ObjectId): Promise<UserSession> {
    const updatedUserSession = await this.userSessionModel.findByIdAndUpdate(
      id,
      { updatedAt: new Date(), sessionEnd: null },
      { new: true },
    );
    return updatedUserSession;
  }

  async findOneByClientId(clientId: string): Promise<UserSession> {
    const userSession = await this.userSessionModel
      .findOne({ clientId })
      .exec();
    return userSession;
  }

  async findUserSessionDetails(
    id: mongoose.Types.ObjectId,
  ): Promise<UserSession> {
    const result = await this.userSessionModel
      .aggregate([
        {
          $match: { _id: id },
        },
        {
          $lookup: {
            from: 'questions',
            let: { questions: '$questions', name: '$name' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ['$_id', '$$questions'],
                  },
                },
              },
              {
                $addFields: {
                  text: {
                    $cond: {
                      if: {
                        $eq: ['$index', 1],
                      },
                      then: {
                        $replaceAll: {
                          input: '$text',
                          find: '{name}',
                          replacement: '$$name',
                        },
                      },
                      else: '$text',
                    },
                  },
                },
              },
              {
                $lookup: {
                  from: 'answers',
                  let: { questionId: '$_id', sessionId: id },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ['$question', '$$questionId'] },
                            { $eq: ['$session', '$$sessionId'] },
                          ],
                        },
                      },
                    },
                  ],
                  as: 'answer',
                },
              },
              {
                $addFields: {
                  answer: { $arrayElemAt: ['$answer', 0] },
                },
              },
            ],
            as: 'questions',
          },
        },
      ])
      .exec();
    console.log(result);
    return result.length > 0 ? result[0] : null;
  }

  findAll() {
    return this.userSessionModel.find().exec();
  }

  async findOne(id: mongoose.Types.ObjectId): Promise<UserSession> {
    return await this.userSessionModel.findById(id).exec();
  }

  async addQuestion(
    id: mongoose.Types.ObjectId,
    questionId: mongoose.Types.ObjectId,
  ) {
    const userSession = await this.userSessionModel.findById(id).exec();
    if (!userSession) {
      throw new Error('User session not found');
    }
    const updatedUserSession = await this.userSessionModel.findByIdAndUpdate(
      id,
      {
        $push: { questions: questionId },
        $set: { updatedAt: new Date() },
        $inc: {
          currentQuestionIndex: 1,
        },
      },
      { new: true },
    );
    return updatedUserSession;
  }

  async update(
    id: mongoose.Types.ObjectId,
    updateUserSessionDto: UpdateUserSessionDto,
  ) {
    const updatedUserSession = await this.userSessionModel.findByIdAndUpdate(
      id,
      updateUserSessionDto,
      { new: true },
    );
    return updatedUserSession;
  }

  remove(id: mongoose.Types.ObjectId) {
    return this.userSessionModel.findByIdAndDelete(id).exec();
  }
}
