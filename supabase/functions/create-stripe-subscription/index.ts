
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import Stripe from "https://esm.sh/stripe@13.6.0?target=deno"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const supabase = createClient(supabaseUrl!, supabaseKey!);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateSubscriptionBody {
  organizationId: string;
  planType: string;
}

// Mapa de planos para preços no Stripe
const planPriceMap: Record<string, string> = {
  basic: Deno.env.get('STRIPE_PRICE_BASIC') || '',
  professional: Deno.env.get('STRIPE_PRICE_PROFESSIONAL') || '',
  enterprise: Deno.env.get('STRIPE_PRICE_ENTERPRISE') || ''
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { organizationId, planType } = await req.json() as CreateSubscriptionBody;
    
    console.log(`Iniciando criação automática de assinatura no Stripe para organização ${organizationId} com plano ${planType}`);

    // Verificar se existe uma assinatura inativa no Supabase
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('status', 'inactive')
      .single();

    if (subError) {
      console.error('Erro ao buscar assinatura inativa:', subError);
      throw new Error('Assinatura inativa não encontrada');
    }

    // Buscar detalhes da organização
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .single();

    if (orgError) {
      console.error('Erro ao buscar organização:', orgError);
      throw new Error('Organização não encontrada');
    }

    // Usar email do admin se o email da organização não estiver definido
    const customerEmail = organization.email || organization.admin_email;
    
    if (!customerEmail) {
      console.error('Erro: Organização sem email definido');
      throw new Error('Email do cliente não definido');
    }

    // Criar ou recuperar o cliente no Stripe
    let customer;
    const existingCustomers = await stripe.customers.search({
      query: `metadata['organization_id']:'${organizationId}'`,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
      console.log(`Cliente existente encontrado no Stripe: ${customer.id}`);
      
      // Atualizar o email do cliente se necessário
      if (!customer.email) {
        await stripe.customers.update(customer.id, {
          email: customerEmail
        });
        console.log(`Email do cliente atualizado: ${customerEmail}`);
      }
    } else {
      // Criar novo cliente no Stripe
      customer = await stripe.customers.create({
        email: customerEmail,
        name: organization.name,
        metadata: {
          organization_id: organizationId,
        },
      });
      console.log(`Novo cliente criado no Stripe: ${customer.id} com email: ${customerEmail}`);
    }

    // Obter o preço do plano
    const priceId = planPriceMap[planType];
    if (!priceId) {
      throw new Error(`Preço não definido para o plano ${planType}`);
    }

    // Criar assinatura no Stripe
    console.log(`Criando assinatura no Stripe para o cliente ${customer.id} com o preço ${priceId}`);
    const stripeSubscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    // Atualizar a assinatura no Supabase
    console.log(`Atualizando assinatura ${subscription.id} no Supabase com ID do Stripe ${stripeSubscription.id}`);
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        stripe_subscription_id: stripeSubscription.id,
        stripe_customer_id: customer.id,
        status: stripeSubscription.status,
        current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
      })
      .eq('id', subscription.id);

    if (updateError) {
      console.error('Erro ao atualizar assinatura no Supabase:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        subscriptionId: stripeSubscription.id,
        customerId: customer.id,
        status: stripeSubscription.status
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
