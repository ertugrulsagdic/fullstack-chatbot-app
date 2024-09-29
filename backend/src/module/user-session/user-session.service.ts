import { Injectable } from '@nestjs/common';
import { CreateUserSessionDto } from './dto/create-user-session.dto';
import { UpdateUserSessionDto } from './dto/update-user-session.dto';
import { UserSession } from './schemas/user-session.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class UserSessionService {
  constructor(
    @InjectModel(UserSession.name)
    private readonly userSessionModel: Model<UserSession>,
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

  findAll() {
    return this.userSessionModel.find().exec();
  }

  async findOne(id: mongoose.Types.ObjectId): Promise<UserSession> {
    return await this.userSessionModel.findById(id).exec();
  }

  update(
    id: mongoose.Types.ObjectId,
    updateUserSessionDto: UpdateUserSessionDto,
  ) {
    const updatedUserSession = this.userSessionModel.findByIdAndUpdate(
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
