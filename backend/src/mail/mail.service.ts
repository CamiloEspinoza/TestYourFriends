import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

interface SendResultsEmailParams {
  to: string;
  participantName: string;
  sessionCode: string;
  characterName: string;
  characterDescription: string;
  scoreP: number;
  scoreI: number;
  scoreE: number;
  scoreR: number;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly baseUrl: string;

  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>(
      'APP_BASE_URL',
      'http://localhost',
    );
  }

  async sendOtpEmail(to: string, code: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject: `${code} es tu código de verificación - TestYourFriends`,
        template: 'otp',
        context: {
          code,
          year: new Date().getFullYear(),
        },
      });
      this.logger.log(`OTP email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP email to ${to}`, error);
    }
  }

  async sendGroupResultsEmail(params: SendResultsEmailParams): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: params.to,
        subject: `Tus resultados: ${params.characterName} - TestYourFriends`,
        template: 'group-results',
        context: {
          participantName: params.participantName,
          sessionCode: params.sessionCode,
          characterName: params.characterName,
          characterDescription: params.characterDescription,
          scoreP: params.scoreP,
          scoreI: params.scoreI,
          scoreE: params.scoreE,
          scoreR: params.scoreR,
          groupResultsUrl: `${this.baseUrl}/s/${params.sessionCode}/group`,
          year: new Date().getFullYear(),
        },
      });
      this.logger.log(`Email sent to ${params.to} for session ${params.sessionCode}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${params.to}`, error);
    }
  }
}
