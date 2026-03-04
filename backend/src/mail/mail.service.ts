import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  SESClient,
  SendEmailCommand,
  type SendEmailCommandInput,
} from '@aws-sdk/client-ses';
import * as Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';

interface SendResultsEmailParams {
  to: string;
  participantName: string;
  sessionCode: string;
  characterName: string;
  characterDescription: string;
  scores: Record<string, number>;
  dimensionLabels: Record<string, string>;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly baseUrl: string;
  private readonly apiBaseUrl: string;
  private readonly sesClient: SESClient | null = null;
  private readonly fromEmail: string | null = null;
  private readonly templatesDir: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const appBaseUrl = this.configService.get<string>(
      'APP_BASE_URL',
      'http://localhost',
    );
    this.baseUrl = appBaseUrl;
    this.apiBaseUrl = `${appBaseUrl.replace(/\/$/, '')}/api`;

    const region = this.configService.get<string>('AWS_REGION');
    const sesFrom = this.configService.get<string>('SES_FROM_EMAIL');

    if (sesFrom && region) {
      const accessKey = this.configService.get<string>('AWS_ACCESS_KEY_ID');
      const secretKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
      this.sesClient = new SESClient({
        region,
        ...(accessKey &&
          secretKey && {
            credentials: {
              accessKeyId: accessKey,
              secretAccessKey: secretKey,
            },
          }),
      });
      this.fromEmail = sesFrom;
      this.logger.log('SES email transport configured');
    } else {
      this.logger.log(
        'SES not configured (missing AWS_REGION or SES_FROM_EMAIL) - emails will be logged to console',
      );
    }

    // Try src first (dev with mounted volumes), fallback to dist (compiled output)
    const srcTemplates = join(process.cwd(), 'src', 'mail', 'templates');
    const distTemplates = join(__dirname, 'templates');
    try {
      readFileSync(join(srcTemplates, 'otp.hbs'), 'utf-8');
      this.templatesDir = srcTemplates;
    } catch {
      this.templatesDir = distTemplates;
    }
  }

  private renderTemplate(
    name: string,
    context: Record<string, unknown>,
  ): string {
    const path = join(this.templatesDir, `${name}.hbs`);
    const source = readFileSync(path, 'utf-8');
    const template = Handlebars.compile(source);
    return template(context);
  }

  private injectTrackingPixel(html: string, emailLogId: string): string {
    const pixelUrl = `${this.apiBaseUrl}/track/open/${emailLogId}`;
    const pixel = `<img src="${pixelUrl}" width="1" height="1" alt="" style="display:block" />`;
    return html.replace('</body>', `${pixel}</body>`);
  }

  private buildTrackedClickUrl(destinationUrl: string, emailLogId: string): string {
    const encoded = encodeURIComponent(destinationUrl);
    return `${this.apiBaseUrl}/track/click/${emailLogId}?url=${encoded}`;
  }

  private async sendEmail(
    to: string,
    subject: string,
    htmlBody: string,
    emailLogId: string | null,
  ): Promise<string | null> {
    const html = emailLogId
      ? this.injectTrackingPixel(htmlBody, emailLogId)
      : htmlBody;

    if (this.sesClient && this.fromEmail) {
      const input: SendEmailCommandInput = {
        Source: `"TestYourFriends" <${this.fromEmail}>`,
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Subject: {
            Data: subject,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: html,
              Charset: 'UTF-8',
            },
          },
        },
      };
      const response = await this.sesClient.send(new SendEmailCommand(input));
      return response.MessageId ?? null;
    } else {
      this.logger.log(
        `[DEV] Email to ${to} - Subject: ${subject} - Body logged`,
      );
      this.logger.debug(html);
      return null;
    }
  }

  async sendOtpEmail(to: string, code: string): Promise<void> {
    const subject = `${code} es tu código de verificación - TestYourFriends`;
    try {
      const log = await this.prisma.emailLog.create({
        data: {
          to,
          subject,
          template: 'otp',
          context: { code },
        },
      });

      const html = this.renderTemplate('otp', {
        code,
        year: new Date().getFullYear(),
      });

      const messageId = await this.sendEmail(to, subject, html, log.id);

      await this.prisma.emailLog.update({
        where: { id: log.id },
        data: { messageId },
      });

      this.logger.log(`OTP email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP email to ${to}`, error);
      throw error;
    }
  }

  async sendGroupResultsEmail(params: SendResultsEmailParams): Promise<void> {
    const subject = `Tus resultados: ${params.characterName} - TestYourFriends`;
    const groupResultsUrl = `${this.baseUrl}/s/${params.sessionCode}/group`;

    try {
      const log = await this.prisma.emailLog.create({
        data: {
          to: params.to,
          subject,
          template: 'group-results',
          context: {
            participantName: params.participantName,
            sessionCode: params.sessionCode,
            characterName: params.characterName,
          },
        },
      });

      const trackedGroupResultsUrl = this.buildTrackedClickUrl(
        groupResultsUrl,
        log.id,
      );

      // Build score entries as array for template iteration
      const scoreEntries = Object.entries(params.scores).map(([dim, score]) => ({
        label: params.dimensionLabels[dim] ?? dim,
        score,
      }));

      const html = this.renderTemplate('group-results', {
        participantName: params.participantName,
        sessionCode: params.sessionCode,
        characterName: params.characterName,
        characterDescription: params.characterDescription,
        scores: scoreEntries,
        groupResultsUrl: trackedGroupResultsUrl,
        year: new Date().getFullYear(),
      });

      const messageId = await this.sendEmail(
        params.to,
        subject,
        html,
        log.id,
      );

      await this.prisma.emailLog.update({
        where: { id: log.id },
        data: { messageId },
      });

      this.logger.log(
        `Email sent to ${params.to} for session ${params.sessionCode}`,
      );
    } catch (error) {
      this.logger.error(`Failed to send email to ${params.to}`, error);
      throw error;
    }
  }
}
