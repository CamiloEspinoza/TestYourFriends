import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SessionService } from './session.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { CreateSessionDto } from './dto/create-session.dto.js';
import { JoinSessionDto } from './dto/join-session.dto.js';
import { SubmitAnswersDto } from './dto/submit-answers.dto.js';
import { SaveProgressDto } from './dto/save-progress.dto.js';

@Controller('sessions')
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: { sub: string },
    @Body() dto: CreateSessionDto,
  ) {
    return this.sessionService.create(user.sub, dto.quizSlug);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findMy(
    @CurrentUser() user: { sub: string },
    @Query('locale') locale = 'es',
  ) {
    return this.sessionService.findMySessions(user.sub, locale);
  }

  @Get(':code')
  findByCode(@Param('code') code: string, @Query('locale') locale = 'es') {
    return this.sessionService.findByCode(code, locale);
  }

  @Post(':code/join')
  join(@Param('code') code: string, @Body() dto: JoinSessionDto) {
    return this.sessionService.join(code, dto.name, dto.email, dto.locale ?? 'es');
  }

  @Post(':code/progress')
  saveProgress(@Param('code') code: string, @Body() dto: SaveProgressDto) {
    return this.sessionService.saveProgress(
      code,
      dto.participantId,
      dto.questionId,
      dto.dimension,
    );
  }

  @Post(':code/submit')
  submit(@Param('code') code: string, @Body() dto: SubmitAnswersDto) {
    return this.sessionService.submit(code, dto.participantId, dto.answers, dto.locale ?? 'es');
  }

  @Get(':code/results')
  getResults(@Param('code') code: string, @Query('locale') locale = 'es') {
    return this.sessionService.getResults(code, locale);
  }

  @Patch(':code/close')
  @UseGuards(JwtAuthGuard)
  close(
    @CurrentUser() user: { sub: string },
    @Param('code') code: string,
  ) {
    return this.sessionService.close(code, user.sub);
  }
}
