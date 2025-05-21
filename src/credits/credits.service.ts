import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ContactProviderDto } from './dto/contact-provider.dto';
import { SubscriptionService } from './subscription.service';

@Injectable()
export class CreditsService {
  constructor(
    private supabaseService: SupabaseService,
    private subscriptionService: SubscriptionService,
  ) {}

  async initializeProviderCredits(userId: string): Promise<void> {
    await this.supabaseService
      .getClient()
      .from('user_credits')
      .insert({ user_id: userId, amount: 0 });
  }

  async getCredits(userId: string): Promise<number> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('user_credits')
      .select('amount')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data?.amount || 0;
  }

  async hasEnoughCredits(userId: string): Promise<boolean> {
    const credits = await this.getCredits(userId);
    return credits > 0;
  }

  async decrementCredits(userId: string): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .from('user_credits')
      .update({ amount: this.supabaseService.getClient().rpc('decrement_amount') })
      .eq('user_id', userId);

    if (error) throw error;
  }

  async addCredits(userId: string, amount: number): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .from('user_credits')
      .update({ amount: this.supabaseService.getClient().rpc('increment_amount', { amount }) })
      .eq('user_id', userId);

    if (error) throw error;
  }

  async contactProvider(contactDto: ContactProviderDto): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .from('provider_contacts')
      .insert({
        user_id: contactDto.user_id,
        provider_id: contactDto.provider_id,
        message: contactDto.message,
      });

    if (error) throw error;
  }
} 