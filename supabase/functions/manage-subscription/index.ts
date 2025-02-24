
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { organizationId, paymentMethodId, priceId } = await req.json() as CreateSubscriptionBody;

    // Buscar informações da organização
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .single();

    if (orgError || !organization) {
      throw new Error('Organização não encontrada');
    }

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

    // Registrar a assinatura no banco de dados
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
  } catch (error) {
    console.error('Erro ao criar assinatura:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
