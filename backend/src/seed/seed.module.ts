import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { SeedService } from './seed.service';
import { QuestionModule } from 'src/module/question/question.module';
import { SeedCommand } from './seed.command';

@Module({
  imports: [CommandModule, QuestionModule],
  providers: [SeedService, SeedCommand],
  exports: [SeedService],
})
export class SeedModule {}
