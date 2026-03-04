import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service.js';
import { TrackController } from './track.controller.js';

@Module({
  imports: [ConfigModule],
  controllers: [TrackController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
