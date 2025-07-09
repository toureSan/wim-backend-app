import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { GeoService } from './services/geo.service';
import { ProvidersModule } from 'src/providers/providers.module';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { ProvidersService } from 'src/providers/providers.service';

@Module({
  imports: [SupabaseModule, ProvidersModule],
  controllers: [UsersController],
  providers: [UsersService, GeoService, ProvidersService],
  exports: [UsersService],
})
export class UsersModule {}
