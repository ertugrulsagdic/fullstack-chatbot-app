import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { SeedService } from './seed.service';

@Injectable()
export class SeedCommand {
  constructor(private readonly seedService: SeedService) {}

  @Command({
    command: 'seed:questions',
    describe: 'Seed static questions to the database',
  })
  async seedQuestions() {
    try {
      await this.seedService.seedQuestions();
    } catch (error) {
      console.error('Error seeding questions:', error);
    }
  }
}
