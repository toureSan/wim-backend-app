import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsString } from 'class-validator';
import { ServiceRequestStatus } from '../enum/ServiceRequestStatus';

export class CreateServiceRequestDto {
  @ApiProperty()
  @IsString()
  service_id: string;

  @ApiProperty()
  @IsString()
  client_id: string;

  @ApiProperty()
  @IsString()
  provider_id: string;

  @ApiProperty({
    enum: ServiceRequestStatus,
    enumName: 'ServiceRequestStatus',
    example: ServiceRequestStatus.PENDING,
  })
  @IsEnum(ServiceRequestStatus)
  status?: ServiceRequestStatus;

  @ApiProperty()
  @IsDateString()
  request_date: Date;
}
