import { Injectable } from '@nestjs/common';
import { CreateUserSessionDto } from './dto/create-user-session.dto';
import { UpdateUserSessionDto } from './dto/update-user-session.dto';
import { UserSession } from './schemas/user-session.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserSessionService {
  constructor(
    @InjectModel(UserSession.name)
    private readonly userSessionModel: Model<UserSession>,
  ) {}

  async startSession(createUserSessionDto: CreateUserSessionDto) {
    const createdUserSession =
      await this.userSessionModel.create(createUserSessionDto);
    return createdUserSession;
  }

  async endSession(id: number) {
    const updatedUserSession = await this.userSessionModel.findByIdAndUpdate(
      id,
      { sessionEnd: new Date() },
      { new: true },
    );
    return updatedUserSession;
  }

  findAll() {
    return this.userSessionModel.find().exec();
  }

  findOne(id: number) {
    return this.userSessionModel.findById(id).exec();
  }

  update(id: number, updateUserSessionDto: UpdateUserSessionDto) {
    const updatedUserSession = this.userSessionModel.findByIdAndUpdate(
      id,
      updateUserSessionDto,
      { new: true },
    );
    return updatedUserSession;
  }

  remove(id: number) {
    return this.userSessionModel.findByIdAndDelete(id).exec();
  }
}
