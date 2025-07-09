import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { SubscriptionService } from '../credits/subscription.service';

type SubscriptionPlan = 'basic' | 'premium';

@Injectable()
export class PaymentsService {
  createSubscription(id: string, plan: string) {
    throw new Error('Method not implemented.');
  }
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly subscriptionService: SubscriptionService,
  ) {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined');
    }
    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });
  }

  async createCheckoutSession(userId: string, plan: string): Promise<{ url: string }> {
    const validatedPlan = this.validatePlan(plan);
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: this.getPriceIdForPlan(validatedPlan),
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${this.configService.get('FRONTEND_URL')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get('FRONTEND_URL')}/payment/cancel`,
      metadata: {
        userId,
        plan: validatedPlan,
      },
    });

    return { url: session.url || '' };
  }

  async handleWebhook(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata || {};

      if (!metadata.userId || !metadata.plan) {
        throw new BadRequestException('Missing metadata in session');
      }

      const { userId, plan } = metadata;
      const validatedPlan = this.validatePlan(plan);

      // Update user's subscription
      await this.subscriptionService.createSubscription(userId, validatedPlan);
    }
  }

  private validatePlan(plan: string): SubscriptionPlan {
    if (plan !== 'basic' && plan !== 'premium') {
      throw new BadRequestException(`Invalid plan: ${plan}`);
    }
    return plan;
  }

  private getPriceIdForPlan(plan: SubscriptionPlan): string {
    const priceIds = {
      basic: this.configService.get<string>('STRIPE_BASIC_PRICE_ID'),
      premium: this.configService.get<string>('STRIPE_PREMIUM_PRICE_ID'),
    };

    const priceId = priceIds[plan];
    if (!priceId) {
      throw new BadRequestException(`Price ID not found for plan: ${plan}`);
    }

    return priceId;
  }
} 