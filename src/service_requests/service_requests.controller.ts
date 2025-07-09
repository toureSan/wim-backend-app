import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ServiceRequestsService } from './service_requests.service';
import { CreateServiceRequestDto } from './dto/create-service_request.dto';
import { UpdateServiceRequestDto } from './dto/update-service_request.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('service-requests')
@Controller('service-requests')
export class ServiceRequestsController {
  constructor(
    private readonly serviceRequestsService: ServiceRequestsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer une demande de service' })
  create(@Body() createServiceRequestDto: CreateServiceRequestDto) {
    return this.serviceRequestsService.create(createServiceRequestDto);
  }

  @Get()
  findAll() {
    return this.serviceRequestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceRequestsService.findOne(+id);
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: "Récupérer les demandes de service d'un client" })
  findByClient(@Param('clientId') clientId: string) {
    return this.serviceRequestsService.getServiceRequestsByClientId(clientId);
  }

  @Get('provider/:providerId')
  @ApiOperation({
    summary: "Récupérer les demandes de service d'un prestataire",
  })
  findByProvider(@Param('providerId') providerId: string) {
    return this.serviceRequestsService.getServiceRequestsByProviderId(
      providerId,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier une demande de service' })
  update(
    @Param('id') id: string,
    @Body() updateServiceRequestDto: UpdateServiceRequestDto,
  ) {
    return this.serviceRequestsService.update(+id, updateServiceRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceRequestsService.remove(+id);
  }
}
