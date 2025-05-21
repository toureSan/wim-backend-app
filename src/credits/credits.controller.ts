import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { ContactProviderDto } from './dto/contact-provider.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('credits')
@UseGuards(JwtAuthGuard)
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  @Get(':userId')
  async getCredits(@Param('userId') userId: string): Promise<number> {
    return this.creditsService.getCredits(userId);
  }

  @Post('contact')
  async contactProvider(
    @Request() req,
    @Body() contactDto: ContactProviderDto,
  ): Promise<void> {
    await this.creditsService.contactProvider({
      ...contactDto,
      user_id: req.user.id,
    });
  }

  @Post(':userId/add')
  async addCredits(
    @Param('userId') userId: string,
    @Body('amount') amount: number
  ): Promise<void> {
    await this.creditsService.addCredits(userId, amount);
  }
} 