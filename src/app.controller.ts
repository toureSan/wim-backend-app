import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('api')
  getApiInfo() {
    return {
      message: 'Welcome to WIM API',
      version: '1.0.0',
      endpoints: {
        auth: '/auth',
        users: '/users',
        credits: '/credits',
        payments: '/payments',
        notifications: '/notifications'
      }
    };
  }
}
