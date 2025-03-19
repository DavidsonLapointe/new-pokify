
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'incomplete' | 'incomplete_expired' | 'inactive';

export interface Plan {
  id: string | number;
  name: string;
  price: number;
  shortDescription?: string;
  description?: string;
  benefits?: string[];
  features?: string[];
  active: boolean;
  stripeProductId?: string;
  stripePriceId?: string;
  credits?: number | null;
  // Additional properties used in AdminModules
  howItWorks?: string[];
  comingSoon?: boolean;
  actionButtonText?: string;
  icon?: string;
  // Module status property
  status?: "not_contracted" | "contracted" | "configured" | "coming_soon" | "setup";
  // Backward compatibility
  callsIncluded?: number;
  isPopular?: boolean;
}

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

export interface CreateSubscriptionDTO {
  organizationId: string;
  paymentMethodId: string;
  priceId: string;
}
