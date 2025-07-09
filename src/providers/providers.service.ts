import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class ProvidersService {
  constructor(private supabaseService: SupabaseService) {}

  async createProvider(userId: string): Promise<any> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('providers')
      .insert({
        profile_id: userId,
      })
      .select()
      .single();

    if (error) {
      throw new BadRequestException(
        'Erreur lors de la création du provider : ' + error.message,
      );
    }

    return data;
  }

  findAll() {
    return `This action returns all providers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} provider`;
  }

  update(id: number, updateProviderDto: UpdateProviderDto) {
    return `This action updates a #${id} provider`;
  }

  remove(id: number) {
    return `This action removes a #${id} provider`;
  }
}
