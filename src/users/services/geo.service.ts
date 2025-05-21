import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class GeoService {
  private readonly GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

  constructor(private readonly configService: ConfigService) {}

  async geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
    const apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');
    console.log('API Key:', apiKey); // Log de la clé API (masquée partiellement)
    console.log('Address to geocode:', address); // Log de l'adresse

    if (!apiKey) {
      throw new Error('Google Maps API key is not configured');
    }

    try {
      console.log('Making request to Google Maps API...'); // Log avant la requête
      const response = await axios.get(this.GOOGLE_MAPS_API_URL, {
        params: {
          address,
          key: apiKey,
        },
      });

      console.log('Google Maps API response:', JSON.stringify(response.data, null, 2)); // Log formaté de la réponse

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        console.log('Location found:', location); // Log des coordonnées
        return {
          lat: location.lat,
          lng: location.lng,
        };
      }

      console.log('No results found in response'); // Log si pas de résultats
      throw new Error(`Address not found. Status: ${response.data.status}`);
    } catch (error) {
      console.error('Full error object:', error); // Log de l'erreur complète
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      throw new Error(`Geocoding failed: ${error.message}`);
    }
  }
} 