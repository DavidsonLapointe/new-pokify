
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
  paymentMethodId: string;
  priceId: string;
}

interface CreateSetupIntentBody {
  action: string;
  organizationId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    console.log('Requisição recebida:', requestBody);
    
    // Handle create_setup_intent action
    if (requestBody.action === 'create_setup_intent') {
      console.log('Criando setup intent para organização:', requestBody.organizationId);
      return await handleCreateSetupIntent(requestBody);
    }
    
    // Handle create subscription action (default)
    const { organizationId, paymentMethodId, priceId } = requestBody as CreateSubscriptionBody;
    return await handleCreateSubscription(organizationId, paymentMethodId, priceId);
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Handle setup intent creation
async function handleCreateSetupIntent(body: CreateSetupIntentBody) {
  try {
    const { organizationId } = body;
    console.log('Processando setup intent para organização ID:', organizationId);
    
    // Buscar informações da organização
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .single();

    if (orgError || !organization) {
      console.error('Organização não encontrada:', orgError);
      throw new Error('Organização não encontrada');
    }

    console.log('Organização encontrada:', organization.name);

    // Verificar se já existe um cliente no Stripe para esta organização
    let customerId;
    try {
      const existingCustomers = await stripe.customers.search({
        query: `metadata['organization_id']:'${organizationId}'`,
      });

      if (existingCustomers.data.length > 0) {
        customerId = existingCustomers.data[0].id;
        console.log('Cliente Stripe existente encontrado:', customerId);
      } else {
        // Criar novo cliente
        console.log('Criando novo cliente Stripe para:', organization.admin_email || organization.email);
        const customer = await stripe.customers.create({
          email: organization.admin_email || organization.email,
          name: organization.name,
          metadata: {
            organization_id: organizationId,
          },
        });
        customerId = customer.id;
        console.log('Novo cliente Stripe criado:', customerId);
      }
    } catch (stripeError) {
      console.error('Erro ao buscar/criar cliente Stripe:', stripeError);
      throw new Error('Erro ao processar cliente no Stripe');
    }

    // Criar o setup intent
    console.log('Criando setup intent para cliente:', customerId);
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
      usage: 'off_session',
    });

    console.log('Setup intent criado com sucesso, client_secret:', setupIntent.client_secret?.substring(0, 10) + '...');

    return new Response(
      JSON.stringify({
        clientSecret: setupIntent.client_secret,
        customerId: customerId,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Erro ao criar setup intent:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}

// Handle subscription creation
async function handleCreateSubscription(organizationId: string, paymentMethodId: string, priceId: string) {
  // Buscar informações da organização
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', organizationId)
    .single();

  if (orgError || !organization) {
    throw new Error('Organização não encontrada');
  }

  // Verificar se já existe uma assinatura inativa
  const { data: existingInactiveSubscription, error: subCheckError } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('status', 'inactive')
    .single();

  // Criar ou recuperar o cliente no Stripe
  let customer;
  const existingCustomers = await stripe.customers.search({
    query: `metadata['organization_id']:'${organizationId}'`,
  });

  if (existingCustomers.data.length > 0) {
    customer = existingCustomers.data[0];
    // Atualizar o método de pagamento padrão
    await stripe.customers.update(customer.id, {
      default_payment_method: paymentMethodId,
    });
  } else {
    // Criar novo cliente
    customer = await stripe.customers.create({
      email: organization.email,
      payment_method: paymentMethodId,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
      metadata: {
        organization_id: organizationId,
      },
    });
  }

  // Criar a assinatura
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: priceId }],
    payment_settings: {
      payment_method_types: ['card'],
      save_default_payment_method: 'on_subscription',
    },
    expand: ['latest_invoice.payment_intent'],
  });

  // Se existir uma assinatura inativa, atualizá-la
  if (existingInactiveSubscription) {
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customer.id,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      })
      .eq('id', existingInactiveSubscription.id);

    if (updateError) {
      throw updateError;
    }
  } else {
    // Caso não exista, criar uma nova assinatura
    const { error: subError } = await supabase
      .from('subscriptions')
      .insert({
        organization_id: organizationId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customer.id,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      });

    if (subError) {
      throw subError;
    }
  }

  // Se a assinatura estiver ativa, atualizar o status da organização
  if (subscription.status === 'active') {
    const { error: updateError } = await supabase
      .from('organizations')
      .update({
        status: 'active',
        pending_reason: null,
      })
      .eq('id', organizationId);

    if (updateError) {
      console.error('Erro ao atualizar status da organização:', updateError);
    }
  }

  return new Response(
    JSON.stringify({
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
      status: subscription.status,
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}
