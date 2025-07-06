import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';
import { RegisterDto } from './dto/register.dto';
import { User } from './interfaces/user.interface';;
import { Express } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto, file?: any) {
    let profile_picture_url = registerDto.profile_picture_url;

    if (file) {
      // Upload du fichier dans Supabase Storage
      const supabase = this.supabaseService.getClient();
      const { data, error } = await supabase.storage
        .from('profile-pictures')
        .upload(`avatars/${Date.now()}_${file.originalname}`, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) {
        if (error.message.includes('User already registered')) {
          throw new BadRequestException('Cet utilisateur existe déjà');
        }
        throw new UnauthorizedException(error.message || 'Erreur lors de l\'inscription');
      }

      const { data: publicUrlData } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(data.path);
      profile_picture_url = publicUrlData.publicUrl;
    }

    const { email, password, role, first_name, last_name, address, npa, entreprise_adress } = registerDto;
    const { data, error } = await this.supabaseService
      .getClient()
      .auth
      .signUp({
        email,
        password,
      });

    if (error) {
      throw new UnauthorizedException('Erreur lors de l\'inscription');
    }

    if (data.user) {
      // Créer le profil utilisateur enrichi
      const { error: profileError } = await this.supabaseService
        .getClient()
        .from('profiles')
        .insert({
          id: data.user.id,
          email,
          role,
          first_name,
          last_name,
          address,
          npa,
          entreprise_adress,
          profile_picture_url,
        });

      if (profileError) {
        throw new UnauthorizedException('Erreur lors de la création du profil');
      }

      return {
        id: data.user.id,
        email,
        role,
      };
    }

    throw new UnauthorizedException('Erreur lors de l\'inscription');
  }
} 