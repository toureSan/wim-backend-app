import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateServiceRequestDto } from './dto/create-service_request.dto';
import { UpdateServiceRequestDto } from './dto/update-service_request.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ServiceRequestsService {
  constructor(
    private supabaseService: SupabaseService,
    private usersService: UsersService,
  ) {}

  async create(createServiceRequestDto: CreateServiceRequestDto) {
    const { client_id, service_id, provider_id } = createServiceRequestDto;

    const { data: profile, error: profileError } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select('*')
      .eq('id', client_id)
      .single();

    if (profileError || !profile) {
      throw new NotFoundException("Le profile spécifiée n'existe pas");
    }

    const { data: provider, error: providerError } = await this.supabaseService
      .getClient()
      .from('providers')
      .select('*')
      .eq('id', provider_id)
      .single();

    if (providerError || !provider) {
      throw new NotFoundException("Ce prestataire n'existe pas");
    }

    const { data: service, error: serviceError } = await this.supabaseService
      .getClient()
      .from('services')
      .select('*')
      .eq('id', service_id)
      .single();

    if (serviceError || !service) {
      throw new NotFoundException("Ce service n'existe pas");
    }

    const { data, error } = await this.supabaseService
      .getClient()
      .from('service_requests')
      .insert([createServiceRequestDto])
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      message: 'La demande de service créé avec succès',
      data,
    };
  }

  findAll() {
    return `This action returns all serviceRequests`;
  }

  findOne(id: number) {
    return `This action returns a #${id} serviceRequest`;
  }

  async getServiceRequestsByClientId(client_id: string) {
    let { data } = await this.supabaseService
      .getClient()
      .from('service_requests')
      .select('*, services(*), providers(*)')
      .eq('client_id', client_id)
      .order('created_at', { ascending: false });

    if (!data || data.length === 0) {
      throw new NotFoundException(
        `Aucune demande de service trouvée pour le client avec l'id ${client_id}`,
      );
    }

    await Promise.all(
      data.map(async (request) => {
        const profile = await this.usersService.findOne(
          request.providers.profile_id,
        );

        console.log('profile', profile);
        request.providers = profile;
        return request;
      }),
    );

    // console.log('data', data);

    return data;
  }

  getServiceRequestsByProviderId(provider_id: string) {
    return this.supabaseService
      .getClient()
      .from('service_requests')
      .select('*, services(*), profiles(*)')
      .eq('provider_id', provider_id)
      .order('created_at', { ascending: false });
  }

  async update(id: number, updateServiceRequestDto: UpdateServiceRequestDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('service_requests')
      .update(updateServiceRequestDto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    if (!data) {
      throw new NotFoundException(
        `La demande de service avec l'id ${id} non trouvé`,
      );
    }

    return { message: 'Demande de service mis à jour avec succès', data };
  }

  remove(id: number) {
    return `This action removes a #${id} serviceRequest`;
  }
}
