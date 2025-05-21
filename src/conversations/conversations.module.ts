import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { CreditsModule } from '../credits/credits.module';
import { EmailModule } from '../email/email.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from '../config/mailer.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message]),
    CreditsModule,
    EmailModule,
    SupabaseModule,
    MailerModule.forRoot(mailerConfig),
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService],
  exports: [ConversationsService],
})
export class ConversationsModule {} 