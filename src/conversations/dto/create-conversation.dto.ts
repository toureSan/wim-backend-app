import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateConversationDto {
  @IsUUID()
  @IsNotEmpty()
  client_id: string;

  @IsUUID()
  @IsNotEmpty()
  provider_id: string;

  @IsString()
  @IsNotEmpty()
  initial_message: string;
} 