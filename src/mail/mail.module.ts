import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): MailerOptions => {
        const user = config.get<string>('MAIL_USER')?.trim() ?? '';
        return {
          transport: {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user,
              pass: config.get<string>('MAIL_PASS')?.trim() ?? '',
            },
          },
          defaults: {
            from: `"TURTLE" <${user}>`,
          },
        } as MailerOptions;
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
