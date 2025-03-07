
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

interface CancelSubscriptionBody {
  organizationId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { organizationId } = await req.json() as CancelSubscriptionBody;
    
    console.log(`Iniciando cancelamento de assinatura para organização ${organizationId}`);

    // Buscar a assinatura ativa no Supabase
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('status', 'active')
      .single();

    if (subError || !subscription) {
      console.error('Erro ao buscar assinatura ativa:', subError);
      throw new Error('Assinatura ativa não encontrada');
    }

    if (!subscription.stripe_subscription_id || subscription.stripe_subscription_id === 'pending') {
      console.error('Assinatura sem ID do Stripe válido');
      throw new Error('Assinatura sem ID do Stripe válido');
    }

    console.log(`Cancelando assinatura no Stripe: ${subscription.stripe_subscription_id}`);
    
    // Cancelar a assinatura no Stripe - definir cancel_at_period_end para true
    // Isso permite que a assinatura continue ativa até o final do período atual
    const stripeSubscription = await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      { cancel_at_period_end: true }
    );

    const canceledAt = new Date().toISOString();
    const cancelAt = stripeSubscription.cancel_at 
      ? new Date(stripeSubscription.cancel_at * 1000).toISOString() 
      : new Date(stripeSubscription.current_period_end * 1000).toISOString();

    console.log(`Atualizando assinatura no Supabase (ID: ${subscription.id})`);
    
    // Atualizar a assinatura no Supabase
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        canceled_at: canceledAt,
        cancel_at: cancelAt
      })
      .eq('id', subscription.id);

    if (updateError) {
      console.error('Erro ao atualizar assinatura no Supabase:', updateError);
      throw updateError;
    }

    // Retornar resposta de sucesso
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Assinatura cancelada com sucesso',
        cancelAt: cancelAt,
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000).toISOString()
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
