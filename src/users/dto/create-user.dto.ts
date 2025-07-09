import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  IsDate,
  IsObject,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  password: string;

  @IsString()
  address: string;

  @IsEnum(['client', 'provider', 'admin'])
  role: string;

  @IsOptional()
  @IsString()
  user_id?: string;

  // Provider specific fields (optional)
  @IsOptional()
  @IsString()
  profile_picture_url?: string;

  @IsOptional()
  @IsString()
  service_description?: string;

  @IsOptional()
  @IsNumber()
  service_rate?: number;

  @IsOptional()
  @IsNumber()
  service_radius?: number;

  @IsOptional()
  @IsString()
  experience_description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  provider_references?: string[];

  @IsOptional()
  @IsObject()
  schedule?: object;

  @IsOptional()
  @IsDate()
  start_date?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string[];
}
