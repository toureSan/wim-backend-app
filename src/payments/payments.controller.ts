import {
  Controller,
  Post,
  Body,
  Headers,
  UseGuards,
  Request,
  RawBodyRequest,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';
import { User } from '../auth/interfaces/user.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

interface RequestWithUser extends ExpressRequest {
  user: User;
}

@ApiBearerAuth()
@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Request() req: RawBodyRequest<ExpressRequest>,
  ) {
    if (!req.rawBody) {
      throw new Error('Missing request body');
    }
    return this.paymentsService.handleWebhook(signature, req.rawBody);
  }

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  async createCheckoutSession(
    @Request() req: RequestWithUser,
    @Body('plan') plan: string,
  ): Promise<{ url: string }> {
    return this.paymentsService.createCheckoutSession(req.user.id, plan);
  }
}
