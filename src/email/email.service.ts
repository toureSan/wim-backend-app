import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY is not defined');
    }
    sgMail.setApiKey(apiKey);
  }

  async sendEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
    const fromEmail = this.configService.get<string>('SENDGRID_FROM_EMAIL');
    if (!fromEmail) {
      throw new Error('SENDGRID_FROM_EMAIL is not defined');
    }

    const msg = {
      to,
      from: fromEmail,
      subject,
      text,
      html,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendNewMessageNotification(to: string, subject: string, content: string): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">${subject}</h2>
        <p style="color: #666; line-height: 1.6;">${content}</p>
        <p style="color: #999; font-size: 0.9em;">This is an automated message, please do not reply.</p>
      </div>
    `;

    await this.sendEmail(to, subject, content, html);
  }
} 