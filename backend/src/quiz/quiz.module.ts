import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service.js';

@Module({
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}
