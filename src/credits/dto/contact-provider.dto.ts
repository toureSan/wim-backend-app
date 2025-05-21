import { IsString, IsNotEmpty } from 'class-validator';

export class ContactProviderDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  provider_id: string;

  @IsString()
  @IsNotEmpty()
  message: string;
} 