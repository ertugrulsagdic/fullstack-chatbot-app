import {
  Controller,
  // Get,
  // Post,
  // Body,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';
import { UserSessionService } from './user-session.service';
// import { CreateUserSessionDto } from './dto/create-user-session.dto';
// import { UpdateUserSessionDto } from './dto/update-user-session.dto';

@Controller('user-session')
export class UserSessionController {
  constructor(private readonly userSessionService: UserSessionService) {}

  // @Post()
  // create(@Body() createUserSessionDto: CreateUserSessionDto) {
  //   return this.userSessionService.startSession(createUserSessionDto);
  // }

  // @Patch(':id/end')
  // endSession(@Param('id') id: string) {
  //   return this.userSessionService.endSession(+id);
  // }

  // @Get()
  // findAll() {
  //   return this.userSessionService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userSessionService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateUserSessionDto: UpdateUserSessionDto,
  // ) {
  //   return this.userSessionService.update(+id, updateUserSessionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userSessionService.remove(+id);
  // }
}
