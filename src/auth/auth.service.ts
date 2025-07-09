import {
  Injectable,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';
import { RegisterDto } from './dto/register.dto';
import { ProviderRegisterDto } from './dto/provider-register.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.signInWithPassword({
        email,
        password,
      });

    if (error || !data.user) {
      return null;
    }

    const { data: profile } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select('id, email, role')
      .eq('id', data.user.id)
      .single();

    if (!profile) {
      return null;
    }

    return {
      id: profile.id,
      email: profile.email,
      role: profile.role,
    };
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(email: string, password: string, role: 'client' | 'provider') {
    const { data, error } = await this.supabaseService.getClient().auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException("Erreur lors de l'inscription");
    }

    if (data.user) {
      // Créer le profil utilisateur
      const { error: profileError } = await this.supabaseService
        .getClient()
        .from('profiles')
        .insert({
          id: data.user.id,
          email,
          role,
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

    throw new UnauthorizedException("Erreur lors de l'inscription");
  }
}
