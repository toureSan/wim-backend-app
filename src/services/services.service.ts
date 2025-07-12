import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ServicesService {
  constructor(
    private supabaseService: SupabaseService,
    private usersService: UsersService,
  ) {}
  async create(createServiceDto: CreateServiceDto) {
    const { category_id, provider_id } = createServiceDto;

    const { data: category, error: categoryError } = await this.supabaseService
      .getClient()
      .from('service_categories')
      .select('*')
      .eq('id', category_id)
      .single();

    if (categoryError || !category) {
      throw new NotFoundException("La catégorie spécifiée n'existe pas");
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

    const { data, error } = await this.supabaseService
      .getClient()
      .from('services')
      .insert([createServiceDto])
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      message: 'Service créé avec succès',
      data,
    };
  }

  async findAll(page: number = 1, limit: number = 10) {
    if (page < 1 || limit < 1) {
      throw new BadRequestException('Page et limit doivent être positifs');
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.supabaseService
      .getClient()
      .from('services')
      .select('*, providers (*), service_categories (*)', { count: 'exact' })
      .range(from, to);

    let servicesData;

    if (data && data?.length > 0) {
      servicesData = await Promise.all(
        data?.map(async (service) => {
          if (service.providers.profile_id) {
            const profile = await this.usersService.findOne(
              service.providers.profile_id,
            );

            const { providers, ...serviceData } = service;
            return { ...serviceData, provider: profile };
          }
        }),
      );
    }

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      data: servicesData,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: count ? Math.ceil(count / limit) : 0,
      },
    };
  }

  async findOne(service_id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('services')
      .select('*, providers (*), service_categories (*)')
      .eq('id', service_id)
      .single();

    if (!data) {
      throw new NotFoundException(
        `Aucun service trouvé avec l'id ${service_id}`,
      );
    }

    return data;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('services')
      .update(updateServiceDto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    if (!data) {
      throw new NotFoundException(`Service avec l'id ${id} non trouvé`);
    }

    return { message: 'Service mis à jour avec succès', data };
  }

  async remove(service_id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('services')
      .delete()
      .eq('id', service_id);

    if (error) throw error;
    return { message: 'services supprimé avec succès', data };
  }
}
