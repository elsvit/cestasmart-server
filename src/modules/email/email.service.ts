import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Resend } from 'resend';

const DEFAULT_FROM_EMAIL = 'CestaSmart <noreply@cestasmart.com>';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend | null;
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');

    this.resend = apiKey ? new Resend(apiKey) : null;
    this.fromEmail = this.normalizeFromEmail(
      this.configService.get<string>('RESEND_FROM_EMAIL', DEFAULT_FROM_EMAIL) ??
        DEFAULT_FROM_EMAIL,
    );
  }

  async sendRegistrationCode(email: string, code: string): Promise<void> {
    await this.sendCode(
      email,
      code,
      'Your CestaSmart registration code',
      `Your CestaSmart registration code is ${code}.\n\nThis code expires in 15 minutes. If you did not request this, you can ignore this email.`,
    );
  }

  async sendPasswordResetCode(email: string, code: string): Promise<void> {
    await this.sendCode(
      email,
      code,
      'Your CestaSmart password reset code',
      `Your password reset code is: ${code}\n\nThis code expires in 15 minutes. If you did not request this, you can ignore this email.`,
    );
  }

  async sendAccountDeletionCode(email: string, code: string): Promise<void> {
    await this.sendCode(
      email,
      code,
      'Your CestaSmart account deletion verification code',
      `Your CestaSmart account deletion verification code is ${code}.\n\nThis code expires in 15 minutes. If you did not request this, you can ignore this email.`,
    );
  }

  private async sendCode(
    email: string,
    code: string,
    subject: string,
    text: string,
  ): Promise<void> {
    if (!this.resend) {
      this.logDevFallback(email, code, 'RESEND_API_KEY not set');
      return;
    }

    const { error } = await this.resend.emails.send({
      from: this.fromEmail,
      to: email,
      subject,
      text,
    });

    if (error) {
      this.logger.error(`Failed to send email to ${email}: ${error.message}`);

      if (this.fromEmail.includes('@resend.dev')) {
        this.logger.warn(
          'Resend test domain (resend.dev) can only send to your Resend account email. Verify cestasmart.com at resend.com and set RESEND_FROM_EMAIL to send to any recipient.',
        );
      }

      this.logDevFallback(email, code, error.message);
    }
  }

  private normalizeFromEmail(value: string): string {
    let trimmed = value.trim();

    if (
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ) {
      trimmed = trimmed.slice(1, -1).trim();
    }

    trimmed = trimmed.replace(/^(.+?)\s+"<([^>]+)>"/, '$1 <$2>');

    if (/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(trimmed)) {
      return trimmed;
    }

    if (/^.+<[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+>$/.test(trimmed)) {
      return trimmed;
    }

    this.logger.error(
      `Invalid RESEND_FROM_EMAIL "${value}". Use noreply@cestasmart.com or CestaSmart <noreply@cestasmart.com>`,
    );

    return trimmed;
  }

  private logDevFallback(email: string, code: string, reason: string): void {
    if (this.configService.get<string>('NODE_ENV') === 'production') {
      return;
    }

    this.logger.warn(`Email code for ${email}: ${code} (${reason})`);
  }
}
