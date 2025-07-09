import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ProviderRegisterDto } from './dto/provider-register.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto | ProviderRegisterDto,
  ): Promise<{ access_token: string }> {
    const user = await this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.role,
    );
    return this.authService.login(user);
  }
}
