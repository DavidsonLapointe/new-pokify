
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'incomplete' | 'incomplete_expired' | 'inactive';

export interface Subscription {
  id: string;
  organizationId: string;
  planId?: string;
  plan?: Plan;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAt?: string;
  cancelAtPeriodEnd?: boolean;
  canceledAt?: string;
  createdAt: string;
  updatedAt: string;
}

import { Plan } from '@/components/admin/plans/plan-form-schema';

export interface CreateSubscriptionDTO {
  organizationId: string;
  paymentMethodId: string;
  priceId: string;
}
