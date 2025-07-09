import { Column } from 'typeorm';
import { ServiceRequestStatus } from '../enum/ServiceRequestStatus';

export class ServiceRequest {
  @Column()
  id: string;

  @Column()
  service_id: string;

  @Column()
  client_id: string;

  @Column()
  provider_id: string;

  @Column()
  status: string;

  @Column({ default: ServiceRequestStatus.PENDING })
  request_date: Date;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
