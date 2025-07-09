import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { GeoService } from './services/geo.service';
import { SupabaseService } from '../supabase/supabase.service';
import { ProvidersService } from 'src/providers/providers.service';
import { UserRole } from './enums/user-role.enum';

interface Coordinates {
  lat: number;
  lng: number;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly geoService: GeoService,
    private readonly providersService: ProvidersService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    const { data: existingUser, error: searchError } =
      await this.supabaseService
        .getClient()
        .from('profiles')
        .select('id')
        .eq('email', createUserDto.email)
        .single();

    if (existingUser) {
      throw new BadRequestException(
        'Un utilisateur avec cet email existe déjà.',
      );
    }

    const { data: registerData, error: errorRegister } =
      await this.supabaseService.getClient().auth.signUp({
        email: createUserDto.email,
        password: createUserDto.password,
      });

    if (errorRegister) {
      throw new UnauthorizedException("Erreur lors de l'inscription");
    }

    // Geocode address if provided
    let coordinates: Coordinates | null = null;
    if (createUserDto.address) {
      try {
        coordinates = await this.geoService.geocodeAddress(
          createUserDto.address,
        );
      } catch (error) {
        console.warn('Geocoding failed:', error.message);
        // Continue without coordinates
      }
    }

    const { password, ...registerDto } = createUserDto;

    const { data, error } = await this.supabaseService
      .getClient()
      .from('profiles')
      .insert({
        id: registerData.user?.id,
        ...registerDto,
        ...(coordinates && {
          latitude: coordinates.lat,
          longitude: coordinates.lng,
        }),
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new BadRequestException(error.message);
    }

    console.log('registerData.user?.id', registerData.user?.id);
    console.log('profile data', data.id);

    if (createUserDto.role === UserRole.PROVIDER) {
      await this.providersService.createProvider(data.id);
    }

    return data;
  }

  async findAll(page = 1, limit = 10): Promise<any> {
    const offset = (page - 1) * limit;

    const {
      data: profiles,
      error,
      count,
    } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select(`*, providers (*)`, { count: 'exact' })
      .range(offset, offset + limit - 1);

    if (error) throw new BadRequestException(error.message);

    const enrichedProfiles = profiles.map((profile) => {
      const isPrestataire = profile.role === 'provider';
      const providerData =
        isPrestataire && profile.providers?.length > 0
          ? profile.providers[0]
          : {};

      const { providers, ...profileWithoutProviders } = profile;

      return {
        ...profileWithoutProviders,
        ...(isPrestataire ? { provider: providerData } : {}),
      };
    });

    // 3. Retourner un résultat paginé
    return {
      total: count,
      page,
      limit,
      data: enrichedProfiles,
    };
  }

  async findOne(id: string): Promise<any> {
    const { data: profile, error } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select('*, providers (*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new BadRequestException(error.message);

    if (!profile) {
      throw new BadRequestException('Utilisateur non trouvé');
    }

    const isPrestataire = profile.role === 'provider';
    const providerData =
      isPrestataire && profile.providers?.length > 0
        ? profile.providers[0]
        : {};

    const { providers, ...profileWithoutProviders } = profile;

    return {
      ...profileWithoutProviders,
      ...(isPrestataire ? { provider: providerData } : {}),
    };
  }

  async findByUserId(userId: string): Promise<any> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async update(
    id: string,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<any> {
    // Geocode address if provided
    let coordinates: Coordinates | null = null;
    if (updateUserDto.address) {
      try {
        coordinates = await this.geoService.geocodeAddress(
          updateUserDto.address,
        );
      } catch (error) {
        console.warn('Geocoding failed:', error.message);
        // Continue without coordinates
      }
    }

    const { data, error } = await this.supabaseService
      .getClient()
      .from('profiles')
      .update({
        ...updateUserDto,
        ...(coordinates && {
          latitude: coordinates.lat,
          longitude: coordinates.lng,
        }),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) throw new BadRequestException(error.message);
  }

  async findByEmail(email: string): Promise<any | undefined> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error) return undefined;
    return data;
  }

  async findById(id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select(
        `
        *,
        providers (*)
      `,
      )
      .eq('id', id)
      .single();

    if (error) throw new NotFoundException('Utilisateur non trouvé');
    return data;
  }

  async updateProfile(userId: string, updates: any) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error)
      throw new BadRequestException('Erreur lors de la mise à jour du profil');
    return data;
  }

  async searchProviders(searchParams: {
    service_description?: string;
    service_rate?: number;
    service_radius?: number;
  }) {
    const query = this.supabaseService
      .getClient()
      .from('profiles')
      .select(
        `
        *,
        providers (*)
      `,
      )
      .eq('role', 'provider')
      .eq('is_available', true);

    if (searchParams.service_description) {
      query.ilike(
        'providers.service_description',
        `%${searchParams.service_description}%`,
      );
    }

    if (searchParams.service_rate) {
      query.lte('providers.service_rate', searchParams.service_rate);
    }

    if (searchParams.service_radius) {
      query.gte('providers.service_radius', searchParams.service_radius);
    }

    const { data, error } = await query;

    if (error)
      throw new BadRequestException(
        'Erreur lors de la recherche des providers',
      );
    return data;
  }

  async updateProviderAvailability(userId: string, isAvailable: boolean) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('profiles')
      .update({ is_available: isAvailable })
      .eq('id', userId)
      .select()
      .single();

    if (error)
      throw new BadRequestException(
        'Erreur lors de la mise à jour de la disponibilité',
      );
    return data;
  }
}
