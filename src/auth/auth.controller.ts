import { Controller, Post, Body, UnauthorizedException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ProviderRegisterDto } from './dto/provider-register.dto';
import { memoryStorage } from 'multer';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('login')
  // async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
  //   // La méthode validateUser a été supprimée. À adapter selon la nouvelle logique d'authentification.
  //   throw new UnauthorizedException('Non implémenté');
  // }

  @Post('register')

  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async register(
    @Body() registerDto: RegisterDto | ProviderRegisterDto,
    @UploadedFile() file?: any
  ): Promise<{ access_token: string }> {
    const user = await this.authService.register(registerDto, file);
    return this.authService.login(user);
  }
} 

