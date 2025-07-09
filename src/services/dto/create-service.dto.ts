import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  category_id: string;

  @ApiProperty()
  @IsString()
  provider_id: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty({ type: [String] })
  @IsString({ each: true })
  images: string[];
}
