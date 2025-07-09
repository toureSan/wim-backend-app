import { Test, TestingModule } from '@nestjs/testing';
import { ServiceRequestsController } from './service_requests.controller';
import { ServiceRequestsService } from './service_requests.service';

describe('ServiceRequestsController', () => {
  let controller: ServiceRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceRequestsController],
      providers: [ServiceRequestsService],
    }).compile();

    controller = module.get<ServiceRequestsController>(ServiceRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
