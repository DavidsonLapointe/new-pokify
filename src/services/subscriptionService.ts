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
    
    // Primeiro verificamos se já existe uma assinatura inativa para esta organização
    const { data: existingSubscription, error: checkError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('status', 'inactive')
      .maybeSingle();
      
    if (checkError) {
      console.error('Erro ao verificar assinaturas existentes:', checkError);
    }
    
    // Se já existe uma assinatura inativa, retornamos ela
    if (existingSubscription) {
      console.log('Assinatura inativa já existente, retornando:', existingSubscription.id);
      return {
        id: existingSubscription.id,
        organizationId: existingSubscription.organization_id,
        stripeSubscriptionId: existingSubscription.stripe_subscription_id,
        stripeCustomerId: existingSubscription.stripe_customer_id,
        status: existingSubscription.status,
        currentPeriodStart: existingSubscription.current_period_start,
        currentPeriodEnd: existingSubscription.current_period_end,
        cancelAt: existingSubscription.cancel_at,
        canceledAt: existingSubscription.canceled_at,
        createdAt: existingSubscription.created_at,
        updatedAt: existingSubscription.updated_at,
      };
    }

    // Caso contrário, criamos uma nova assinatura inativa
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .insert({
        organization_id: organizationId,
        status: 'inactive',
        stripe_subscription_id: 'pending', // Será substituído quando a assinatura real for criada
        stripe_customer_id: 'pending', // Será substituído quando a assinatura real for criada
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar assinatura inativa:', error);
      throw error; // Lançamos o erro para ser capturado pelo try/catch que chama esta função
    }

    if (!subscription) {
      console.error('Nenhum dado de assinatura retornado após inserção');
      return null;
    }

    console.log('Assinatura inativa criada com sucesso:', subscription.id);
    
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
  } catch (error) {
    console.error('Erro ao criar assinatura inativa:', error);
    throw error; // Relançamos o erro para que seja tratado corretamente no chamador
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
