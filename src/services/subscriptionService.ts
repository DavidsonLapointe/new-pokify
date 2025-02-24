
import { supabase } from "@/integrations/supabase/client";
import { CreateSubscriptionDTO, Subscription } from "@/types/subscription";

export const createSubscription = async (dto: CreateSubscriptionDTO): Promise<{ subscriptionId: string; clientSecret?: string; status: string }> => {
  const { data, error } = await supabase.functions.invoke('manage-subscription', {
    body: dto
  });

  if (error) throw error;
  return data;
};

export const getOrganizationSubscription = async (organizationId: string): Promise<Subscription | null> => {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Erro ao buscar assinatura:', error);
    return null;
  }

  if (!subscription) return null;

  return {
    id: subscription.id,
    organizationId: subscription.organization_id,
    stripeSubscriptionId: subscription.stripe_subscription_id,
    stripeCustomerId: subscription.stripe_customer_id,
    status: subscription.status,
    currentPeriodStart: subscription.current_period_start,
    currentPeriodEnd: subscription.current_period_end,
    cancelAt: subscription.cancel_at,
    canceledAt: subscription.canceled_at,
    createdAt: subscription.created_at,
    updatedAt: subscription.updated_at,
  };
};
