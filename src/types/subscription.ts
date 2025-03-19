
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

export interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  callsIncluded?: number;
  features: string[];
  isPopular?: boolean;
  active?: boolean;
  stripeProductId?: string;
  stripePriceId?: string;
}

export interface CreateSubscriptionDTO {
  organizationId: string;
  paymentMethodId: string;
  priceId: string;
}
