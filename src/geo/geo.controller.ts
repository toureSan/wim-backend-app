import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { GeoService } from './geo.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { User } from '../auth/interfaces/user.interface';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('geo')
@UseGuards(JwtAuthGuard)
export class GeoController {
  constructor(private readonly geoService: GeoService) {}

  @Get('providers/nearby')
  async findProvidersNearby(
    @Req() req: RequestWithUser,
    @Body() body: { latitude: number; longitude: number; radius: number },
  ) {
    return this.geoService.findProvidersNearby(
      body.latitude,
      body.longitude,
      body.radius,
    );
  }

  @Post('providers/:id/location')
  async updateProviderLocation(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Body() body: { latitude: number; longitude: number },
  ) {
    // Vérifier que l'utilisateur est bien le provider
    if (id !== req.user.id) {
      throw new Error('Vous ne pouvez pas mettre à jour la localisation d\'un autre provider');
    }

    return this.geoService.updateProviderLocation(id, body.latitude, body.longitude);
  }

  @Post('distance')
  async calculateDistance(
    @Body() body: {
      startLat: number;
      startLng: number;
      endLat: number;
      endLng: number;
    },
  ) {
    return this.geoService.calculateDistance(
      body.startLat,
      body.startLng,
      body.endLat,
      body.endLng,
    );
  }
} 