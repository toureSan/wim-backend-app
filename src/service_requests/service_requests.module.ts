import { Module } from '@nestjs/common';
import { ServiceRequestsService } from './service_requests.service';
import { ServiceRequestsController } from './service_requests.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [SupabaseModule, UsersModule],
  controllers: [ServiceRequestsController],
  providers: [ServiceRequestsService],
})
export class ServiceRequestsModule {}
