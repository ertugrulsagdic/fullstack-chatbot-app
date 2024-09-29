import { Injectable } from '@nestjs/common';
import { QuestionService } from 'src/module/question/question.service';
import { questions } from './data';

@Injectable()
export class SeedService {
  constructor(private readonly questionService: QuestionService) {}

  async seedQuestions(): Promise<void> {
    console.log('Checking if questions exist in the database...');
    const questionCount = await this.questionService.count();
    console.log(`Found ${questionCount} questions in the database.`);

    if (questionCount === 0) {
      console.log('Seeding static questions...');
      await this.questionService.createMany(questions);
      console.log('Static questions seeded successfully.');
    } else {
      console.log('Static questions already exist in the database.');
    }
  }
}
