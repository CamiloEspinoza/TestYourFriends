import { Controller, Get, Param, Query } from '@nestjs/common';
import { QuizService } from './quiz.service.js';

@Controller('quizzes')
export class QuizController {
  constructor(private quizService: QuizService) {}

  @Get()
  findAll(@Query('locale') locale = 'es') {
    return this.quizService.findAll(locale);
  }

  @Get('categories')
  findCategories(@Query('locale') locale = 'es') {
    return this.quizService.findCategories(locale);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string, @Query('locale') locale = 'es') {
    return this.quizService.findBySlug(slug, locale);
  }
}
