import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [SupabaseModule, MailerModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {} 