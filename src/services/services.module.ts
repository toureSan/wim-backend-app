import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [SupabaseModule, UsersModule],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
