import { supabase } from "@/integrations/supabase/client";
import { CreateSubscriptionDTO, Subscription } from "@/types/subscription";

export const createSubscription = async (dto: CreateSubscriptionDTO): Promise<{ subscriptionId: string; clientSecret?: string; status: string }> => {
  const { data, error } = await supabase.functions.invoke('manage-subscription', {
    body: dto
  });

  if (error) throw error;
  return data;
};

export const createSetupIntent = async (organizationId: string): Promise<{ clientSecret: string } | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('manage-subscription', {
      body: {
        action: 'create_setup_intent',
        organizationId
      }
    });

    if (error) {
      console.error('Erro ao criar setup intent:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao criar setup intent:', error);
    return null;
  }
};

export const createInactiveSubscription = async (organizationId: string): Promise<Subscription | null> => {
  try {
    console.log('Iniciando criação de assinatura inativa para organização:', organizationId);
    
    // Use the edge function to create an inactive subscription
    const { data, error } = await supabase.functions.invoke('manage-subscription', {
      body: {
        action: 'create_inactive_subscription',
        organizationId
      }
    });
    
    if (error) {
      console.error('Erro ao invocar função para criar assinatura inativa:', error);
      throw error;
    }
    
    if (!data?.success || !data?.subscription) {
      console.error('Função retornou erro ou dados incompletos:', data);
      return null;
    }
    
    console.log('Assinatura inativa criada com sucesso:', data.subscription.id);
    return data.subscription;
  } catch (error) {
    console.error('Erro ao criar assinatura inativa:', error);
    return null; // Return null instead of throwing to avoid breaking the organization creation flow
  }
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

export const cancelSubscription = async (organizationId: string): Promise<{ success: boolean; message: string; cancelAt?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('cancel-subscription', {
      body: { organizationId }
    });

    if (error) {
      console.error('Erro ao invocar função de cancelamento de assinatura:', error);
      throw new Error('Erro ao cancelar assinatura');
    }

    if (!data.success) {
      throw new Error(data.error || 'Erro ao cancelar assinatura');
    }

    return {
      success: true,
      message: 'Assinatura cancelada com sucesso. Acesso permanecerá ativo até o final do período atual.',
      cancelAt: data.cancelAt
    };
  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error);
    throw error;
  }
};

export interface PaymentMethodResponse {
  brand?: string;
  last4?: string;
  expMonth?: number;
  expYear?: number;
}

export const getPaymentMethod = async (organizationId: string): Promise<PaymentMethodResponse | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-payment-method', {
      body: { organizationId }
    });

    if (error || !data.success) {
      console.error('Erro ao buscar método de pagamento:', error || data.error);
      return null;
    }

    return data.paymentMethod || null;
  } catch (error) {
    console.error('Erro ao buscar método de pagamento:', error);
    return null;
  }
};

export const updatePaymentMethod = async (organizationId: string, paymentMethodId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('update-payment-method', {
      body: { organizationId, paymentMethodId }
    });

    if (error || !data.success) {
      console.error('Erro ao atualizar método de pagamento:', error || data.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao atualizar método de pagamento:', error);
    return false;
  }
};
