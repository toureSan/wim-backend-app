import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { CreditsModule } from '../credits/credits.module';

@Module({
  imports: [SupabaseModule, CreditsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {} 