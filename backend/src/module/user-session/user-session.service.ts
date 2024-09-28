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
    private readonly questionModel: Model<UserSession>,
  ) {}

  async startSession(createUserSessionDto: CreateUserSessionDto) {
    const createdUserSession =
      await this.questionModel.create(createUserSessionDto);
    return createdUserSession;
  }

  async endSession(id: number) {
    const updatedUserSession = await this.questionModel.findByIdAndUpdate(
      id,
      { sessionEnd: new Date() },
      { new: true },
    );
    return updatedUserSession;
  }

  findAll() {
    return `This action returns all userSession`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userSession`;
  }

  update(id: number, updateUserSessionDto: UpdateUserSessionDto) {
    const updatedUserSession = this.questionModel.findByIdAndUpdate(
      id,
      updateUserSessionDto,
      { new: true },
    );
    return updatedUserSession;
  }

  remove(id: number) {
    return `This action removes a #${id} userSession`;
  }
}
