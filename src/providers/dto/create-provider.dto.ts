import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateProviderDto {
  @ApiProperty()
  @IsString()
  user_id: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  siret?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  business_name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  postal_code?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  is_verified?: boolean;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  created_at?: Date;
}
