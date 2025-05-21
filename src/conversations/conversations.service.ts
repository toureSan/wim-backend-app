import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class ConversationsService {
  constructor(
    private supabaseService: SupabaseService,
    private mailerService: MailerService,
  ) {}

  async startConversation(createConversationDto: CreateConversationDto) {
    const { client_id, provider_id, initial_message } = createConversationDto;

    const { data: existingConversation } = await this.supabaseService
      .getClient()
      .from('conversations')
      .select('*')
      .eq('client_id', client_id)
      .eq('provider_id', provider_id)
      .single();

    if (existingConversation) {
      throw new BadRequestException('Une conversation existe déjà avec ce provider');
    }
    const { data: conversation, error: conversationError } = await this.supabaseService
      .getClient()
      .from('conversations')
      .insert({
        client_id,
        provider_id,
        status: 'active',
      })
      .select()
      .single();

    if (conversationError) {
      throw new BadRequestException('Erreur lors de la création de la conversation');
    }
    await this.sendMessage({
      conversation_id: conversation.id,
      sender_id: client_id,
      content: initial_message,
    });

    // Envoyer une notification par email au provider
    const { data: provider } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select('email, name')
      .eq('id', provider_id)
      .single();

    if (provider) {
      await this.mailerService.sendMail({
        to: provider.email,
        subject: 'Nouvelle demande de contact',
        template: 'new-conversation',
        context: {
          providerName: provider.name,
          clientId: client_id,
        },
      });
    }

    return conversation;
  }

  async getConversations(userId: string) {
    const { data: conversations, error } = await this.supabaseService
      .getClient()
      .from('conversations')
      .select(`
        *,
        client:profiles!conversations_client_id_fkey(*),
        provider:profiles!conversations_provider_id_fkey(*)
      `)
      .or(`client_id.eq.${userId},provider_id.eq.${userId}`)
      .order('updated_at', { ascending: false });

    if (error) {
      throw new BadRequestException('Erreur lors de la récupération des conversations');
    }

    return conversations;
  }

  async getMessages(conversationId: string) {
    const { data: messages, error } = await this.supabaseService
  
      .getClient()
      .from('messages')
      .select(`
        *,
        sender:profiles(*)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new BadRequestException('Erreur lors de la récupération des messages');
    }

    return messages;
  }

  async sendMessage(sendMessageDto: SendMessageDto) {
    const { conversation_id, sender_id, content } = sendMessageDto;

    // Vérifier si la conversation existe
    const { data: conversation } = await this.supabaseService
      .getClient()
      .from('conversations')
      .select('*')
      .eq('id', conversation_id)
      .single();

    if (!conversation) {
      throw new NotFoundException('Conversation non trouvée');
    }

    // Vérifier si l'utilisateur fait partie de la conversation
    if (conversation.client_id !== sender_id && conversation.provider_id !== sender_id) {
      throw new BadRequestException('Vous n\'êtes pas autorisé à envoyer des messages dans cette conversation');
    }

    // Créer le message
    const { data: message, error: messageError } = await this.supabaseService
      .getClient()
      .from('messages')
      .insert({
        conversation_id,
        sender_id,
        content,
        is_read: false,
      })
      .select()
      .single();

    if (messageError) {
      throw new BadRequestException('Erreur lors de l\'envoi du message');
    }

    // Mettre à jour la date de dernière activité de la conversation
    await this.supabaseService
      .getClient()
      .from('conversations')
      .update({ updated_at: new Date() })
      .eq('id', conversation_id);

    return message;
  }

  async markAsRead(conversationId: string, userId: string) {
    const { error } = await this.supabaseService
      .getClient()
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId);

    if (error) {
      throw new BadRequestException('Erreur lors de la mise à jour du statut de lecture');
    }
  }
} 