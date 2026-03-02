import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailService } from './mail.service.js';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const sesFrom = configService.get<string>('SES_FROM_EMAIL');
        const awsRegion = configService.get<string>('AWS_REGION');

        // If SES is configured, use SES transport; otherwise use JSON transport (dev mode)
        if (sesFrom && awsRegion) {
          return {
            transport: {
              host: `email-smtp.${awsRegion}.amazonaws.com`,
              port: 465,
              secure: true,
              auth: {
                user: configService.get<string>('AWS_SMTP_USER'),
                pass: configService.get<string>('AWS_SMTP_PASS'),
              },
            },
            defaults: {
              from: `"TestYourFriends" <${sesFrom}>`,
            },
            template: {
              dir: join(__dirname, '..', '..', 'mail', 'templates'),
              adapter: new HandlebarsAdapter(),
              options: { strict: true },
            },
          };
        }

        // Dev: use jsonTransport (logs email to console)
        return {
          transport: {
            jsonTransport: true,
          },
          defaults: {
            from: '"TestYourFriends" <noreply@testyourfriends.com>',
          },
          template: {
            dir: join(__dirname, '..', '..', 'mail', 'templates'),
            adapter: new HandlebarsAdapter(),
            options: { strict: true },
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
