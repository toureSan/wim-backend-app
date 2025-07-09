import { IsBoolean, IsDateString, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class ServiceCategory {
  @Column()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @Column({ default: true })
  is_active: boolean;
}
