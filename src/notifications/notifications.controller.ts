import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';
import { User } from '../auth/interfaces/user.interface';

interface RequestWithUser extends ExpressRequest {
  user: User;
}

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(@Request() req: RequestWithUser) {
    return this.notificationsService.getNotifications(req.user.id);
  }

  @Post(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }
} 