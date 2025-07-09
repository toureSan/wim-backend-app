import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  role: 'client' | 'provider';

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  npa?: string;

  @IsString()
  @IsOptional()
  entreprise_adress?: string;

  @IsString()
  @IsOptional()
  profile_picture_url?: string;
} 