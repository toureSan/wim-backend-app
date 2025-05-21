import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  @IsNotEmpty()
  conversation_id: string;

  @IsUUID()
  @IsNotEmpty()
  sender_id: string;

  @IsString()
  @IsNotEmpty()
  content: string;
} 