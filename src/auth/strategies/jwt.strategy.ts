import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SupabaseService } from '../../supabase/supabase.service';
import { User } from '../interfaces/user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private supabaseService: SupabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<User> {
    const { data: user, error } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select('id, email, role')
      .eq('id', payload.sub)
      .single();

    if (error || !user) {
      throw new Error('Utilisateur non trouvé');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
} 