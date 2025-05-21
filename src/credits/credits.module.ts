import { Module } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { CreditsController } from './credits.controller';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [CreditsController, SubscriptionController],
  providers: [CreditsService, SubscriptionService],
  exports: [CreditsService, SubscriptionService],
})
export class CreditsModule {} 