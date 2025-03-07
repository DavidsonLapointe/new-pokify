
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

interface RequestBody {
  organizationId: string;
  paymentMethodId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { organizationId, paymentMethodId } = await req.json() as RequestBody;
    
    console.log(`Atualizando método de pagamento para organização ${organizationId}`);

    // Buscar a assinatura ativa no Supabase para obter o customerId
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('organization_id', organizationId)
      .or('status.eq.active,status.eq.canceled')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (subError || !subscription) {
      console.log('Assinatura não encontrada:', subError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Assinatura não encontrada' 
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!subscription.stripe_customer_id || subscription.stripe_customer_id === 'pending') {
      console.log('Cliente Stripe não encontrado para esta assinatura');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Cliente Stripe não encontrado' 
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Anexar o método de pagamento ao cliente
    await stripe.paymentMethods.attach(
      paymentMethodId,
      { customer: subscription.stripe_customer_id }
    );

    // Definir este método como padrão para o cliente
    await stripe.customers.update(
      subscription.stripe_customer_id,
      { invoice_settings: { default_payment_method: paymentMethodId } }
    );

    // Atualizar as assinaturas existentes para usar o novo método de pagamento
    if (subscription.stripe_subscription_id && subscription.stripe_subscription_id !== 'pending' && subscription.status === 'active') {
      await stripe.subscriptions.update(
        subscription.stripe_subscription_id,
        { default_payment_method: paymentMethodId }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Método de pagamento atualizado com sucesso'
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
