import { IsEnum } from 'class-validator';

export type SubscriptionPlan = 'basic' | 'premium';

export class CreateSubscriptionDto {
  @IsEnum(['basic', 'premium'])
  plan: SubscriptionPlan;
} 