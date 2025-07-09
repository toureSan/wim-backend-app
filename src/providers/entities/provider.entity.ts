import { ApiProperty } from '@nestjs/swagger';

export class Provider {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  business_name: string;

  @ApiProperty()
  siret: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  postal_code: string;

  @ApiProperty()
  is_verified: boolean;

  @ApiProperty()
  created_at: Date;
}
