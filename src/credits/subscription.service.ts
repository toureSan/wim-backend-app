import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { addMonths, addYears, isAfter } from 'date-fns';

@Injectable()
export class SubscriptionService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createSubscription(userId: string, plan: 'basic' | 'premium'): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan,
        start_date: new Date(),
        end_date: this.calculateEndDate(plan),
        status: 'active',
      });

    if (error) throw error;
  }

  async getActiveSubscription(userId: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error) return null;

    // Vérifier si l'abonnement a expiré
    if (data && isAfter(new Date(), new Date(data.end_date))) {
      await this.supabaseService
        .getClient()
        .from('subscriptions')
        .update({ status: 'expired' })
        .eq('id', data.id);

      return null;
    }

    return data;
  }

  async canMakeFreeContact(userId: string): Promise<boolean> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('subscriptions')
      .select('free_contacts_used, plan')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    const maxFreeContacts = data.plan === 'premium' ? 10 : 5;
    return data.free_contacts_used < maxFreeContacts;
  }

  async incrementFreeContacts(userId: string): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .from('subscriptions')
      .update({
        free_contacts_used: this.supabaseService.getClient().rpc('increment_free_contacts'),
      })
      .eq('user_id', userId);

    if (error) throw error;
  }

  async cancelSubscription(userId: string) {
    const { error } = await this.supabaseService
      .getClient()
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('user_id', userId)
      .eq('status', 'active');

    if (error) throw new BadRequestException('Erreur lors de l\'annulation de l\'abonnement');
  }

  private calculateEndDate(plan: 'basic' | 'premium'): Date {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date;
  }
} 