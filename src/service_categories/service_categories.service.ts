import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceCategoryDto } from './dto/create-service_category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service_category.dto';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class ServiceCategoriesService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createServiceCategoryDto: CreateServiceCategoryDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('service_categories')
      .insert(createServiceCategoryDto)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('service_categories')
      .select('*');

    // if (error) throw error;
    return data;
  }

  async findOne(service_categorie_id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('service_categories')
      .select('*')
      .eq('id', service_categorie_id)
      .single();

    if (!data) {
      throw new NotFoundException(
        `Aucune categorie trouvé avec l'id ${service_categorie_id}`,
      );
    }

    return data;
  }

  update(id: number, updateServiceCategoryDto: UpdateServiceCategoryDto) {
    return `This action updates a #${id} serviceCategory`;
  }

  async remove(service_categorie_id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('service_categories')
      .delete()
      .eq('id', service_categorie_id);

    if (error) throw error;
    return { message: 'Utilisateur supprimé avec succès', data };
  }
}
