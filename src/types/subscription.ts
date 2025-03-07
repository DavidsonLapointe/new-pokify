
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'incomplete' | 'incomplete_expired' | 'inactive';

export interface Subscription {
  id: string;
  organizationId: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAt?: string;
  canceledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionDTO {
  organizationId: string;
  paymentMethodId: string;
  priceId: string;
}
