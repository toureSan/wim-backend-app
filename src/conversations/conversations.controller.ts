import { Controller, Get, Post, Body, Param, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { User } from '../auth/interfaces/user.interface';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  async startConversation(
    @Body() createConversationDto: CreateConversationDto,
    @Req() req: RequestWithUser,
  ) {
    // Vérifier que l'utilisateur est bien le client
    if (createConversationDto.client_id !== req.user.id) {
      throw new BadRequestException('Vous ne pouvez pas démarrer une conversation pour un autre utilisateur');
    }

    return this.conversationsService.startConversation(createConversationDto);
  }

  @Get()
  async getConversations(@Req() req: RequestWithUser) {
    return this.conversationsService.getConversations(req.user.id);
  }

  @Get(':id/messages')
  async getMessages(@Param('id') id: string, @Req() req: RequestWithUser) {
    // Marquer les messages comme lus
    await this.conversationsService.markAsRead(id, req.user.id);
    return this.conversationsService.getMessages(id);
  }

  @Post(':id/messages')
  async sendMessage(
    @Param('id') id: string,
    @Body() sendMessageDto: SendMessageDto,
    @Req() req: RequestWithUser,
  ) {
    // Vérifier que l'utilisateur est bien l'expéditeur
    if (sendMessageDto.sender_id !== req.user.id) {
      throw new BadRequestException('Vous ne pouvez pas envoyer de message en tant qu\'un autre utilisateur');
    }

    // Vérifier que le message est envoyé dans la bonne conversation
    if (sendMessageDto.conversation_id !== id) {
      throw new BadRequestException('Le message doit être envoyé dans la conversation spécifiée');
    }

    return this.conversationsService.sendMessage(sendMessageDto);
  }
} 