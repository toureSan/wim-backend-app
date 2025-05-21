import { IsNotEmpty, IsString, IsNumber, IsArray, IsOptional, IsUrl, IsDate } from 'class-validator';
import { RegisterDto } from './register.dto';

export class ProviderRegisterDto extends RegisterDto {
  @IsNotEmpty()
  @IsString()
  service_description: string;

  @IsNotEmpty()
  @IsNumber()
  service_rate: number;

  @IsNotEmpty()
  @IsNumber()
  service_radius: number;

  @IsNotEmpty()
  @IsString()
  experience_description: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  certifications: string[] = [];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  provider_references: string[] = [];

  @IsOptional()
  @IsUrl()
  profile_picture_url?: string;

  @IsOptional()
  @IsDate()
  start_date?: Date;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  services: string[];

  @IsOptional()
  schedule?: {
    monday?: { start: string; end: string }[];
    tuesday?: { start: string; end: string }[];
    wednesday?: { start: string; end: string }[];
    thursday?: { start: string; end: string }[];
    friday?: { start: string; end: string }[];
    saturday?: { start: string; end: string }[];
    sunday?: { start: string; end: string }[];
  };
} 