import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createNotification(userId: string, message: string): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .from('notifications')
      .insert({
        user_id: userId,
        message,
        read: false,
      });

    if (error) throw error;
  }

  async getNotifications(userId: string): Promise<any[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('user_id', userId);

    if (error) throw new BadRequestException('Failed to mark notification as read');
  }
} 