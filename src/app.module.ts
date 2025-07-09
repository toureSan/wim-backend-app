import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CreditsModule } from './credits/credits.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SupabaseModule } from './supabase/supabase.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServiceCategoriesModule } from './service_categories/service_categories.module';
import { ServicesModule } from './services/services.module';
import { ProvidersModule } from './providers/providers.module';
import { ServiceRequestsModule } from './service_requests/service_requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
    UsersModule,
    AuthModule,
    CreditsModule,
    PaymentsModule,
    NotificationsModule,
    ServiceCategoriesModule,
    ServicesModule,
    ProvidersModule,
    ServiceRequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
