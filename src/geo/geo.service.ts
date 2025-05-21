import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { calculateDistance } from './utils/geo.utils';

@Injectable()
export class GeoService {
  constructor(private supabaseService: SupabaseService) {}

  async findProvidersNearby(latitude: number, longitude: number, radius: number) {
    const { data: providers, error } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select(`
        *,
        providers (*)
      `)
      .eq('role', 'provider')
      .eq('is_available', true);

    if (error) {
      throw new Error('Erreur lors de la recherche des providers');
    }

    // Filtrer les providers dans le rayon spécifié
    return providers.filter(provider => {
      const distance = calculateDistance(
        latitude,
        longitude,
        provider.latitude,
        provider.longitude
      );
      return distance <= radius;
    });
  }

  async updateProviderLocation(providerId: string, latitude: number, longitude: number) {
    const { error } = await this.supabaseService
      .getClient()
      .from('profiles')
      .update({
        latitude,
        longitude,
      })
      .eq('id', providerId);

    if (error) {
      throw new Error('Erreur lors de la mise à jour de la localisation');
    }
  }

  async calculateDistance(
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number,
  ): Promise<number> {
    return calculateDistance(startLat, startLng, endLat, endLng);
  }
} 