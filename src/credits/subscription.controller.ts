import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createSubscription(
    @Request() req,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<void> {
    await this.subscriptionService.createSubscription(
      req.user.id,
      createSubscriptionDto.plan as 'basic' | 'premium',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('status')
  async getSubscriptionStatus(@Request() req) {
    return this.subscriptionService.getActiveSubscription(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('cancel')
  async cancelSubscription(@Request() req) {
    return this.subscriptionService.cancelSubscription(req.user.id);
  }
} 