import { Module } from '@nestjs/common';
import { SessionController } from './session.controller.js';
import { SessionService } from './session.service.js';
import { QuizModule } from '../quiz/quiz.module.js';
import { MailModule } from '../mail/mail.module.js';

@Module({
  imports: [QuizModule, MailModule],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
