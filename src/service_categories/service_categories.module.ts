import { Module } from '@nestjs/common';
import { ServiceCategoriesService } from './service_categories.service';
import { ServiceCategoriesController } from './service_categories.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [ServiceCategoriesController],
  providers: [ServiceCategoriesService],
})
export class ServiceCategoriesModule {}
