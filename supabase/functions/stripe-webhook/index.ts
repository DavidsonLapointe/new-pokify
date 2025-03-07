import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { Stripe } from 'https://esm.sh/stripe@13.10.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      return new Response('No signature', { status: 400 })
    }

    const body = await req.text()
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret!)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      // Atualizar o status da compra
      const { error: purchaseError } = await supabase
        .from('credit_purchases')
        .update({ status: 'completed' })
        .eq('stripe_payment_intent_id', session.payment_intent);

      if (purchaseError) throw purchaseError;

      // Atualizar o saldo de créditos
      const { data: balance, error: balanceError } = await supabase
        .from('credit_balances')
        .select('*')
        .eq('organization_id', session.metadata?.organizationId)
        .single();

      if (balanceError && balanceError.code !== 'PGRST116') {
        throw balanceError;
      }

      const credits = parseInt(session.metadata?.credits ?? '0');

      if (balance) {
        // Atualizar saldo existente
        const { error } = await supabase
          .from('credit_balances')
          .update({
            total_credits: balance.total_credits + credits
          })
          .eq('organization_id', session.metadata?.organizationId);

        if (error) throw error;
      } else {
        // Criar novo registro de saldo
        const { error } = await supabase
          .from('credit_balances')
          .insert({
            organization_id: session.metadata?.organizationId,
            total_credits: credits,
            used_credits: 0
          });

        if (error) throw error;
      }
    }
    else if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription;
      
      // Buscar a assinatura no Supabase pelo stripe_subscription_id
      const { data: supabaseSubscription, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('stripe_subscription_id', subscription.id)
        .single();
      
      if (fetchError) {
        console.error('Erro ao buscar assinatura:', fetchError);
        return new Response(JSON.stringify({ error: 'Subscription not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Atualizar informações da assinatura
      const updateData: any = {
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      };
      
      // Se estiver cancelada, atualizar as informações de cancelamento
      if (subscription.cancel_at_period_end) {
        updateData.status = 'canceled';
        if (subscription.cancel_at) {
          updateData.cancel_at = new Date(subscription.cancel_at * 1000).toISOString();
        }
        if (!supabaseSubscription.canceled_at) {
          updateData.canceled_at = new Date().toISOString();
        }
      }
      
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update(updateData)
        .eq('id', supabaseSubscription.id);
      
      if (updateError) {
        console.error('Erro ao atualizar assinatura:', updateError);
        return new Response(JSON.stringify({ error: 'Failed to update subscription' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    else if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      
      // Buscar a assinatura no Supabase pelo stripe_subscription_id
      const { data: supabaseSubscription, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('stripe_subscription_id', subscription.id)
        .single();
      
      if (fetchError) {
        console.error('Erro ao buscar assinatura:', fetchError);
        return new Response(JSON.stringify({ error: 'Subscription not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Marcar a assinatura como cancelada
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          canceled_at: new Date().toISOString(),
        })
        .eq('id', supabaseSubscription.id);
      
      if (updateError) {
        console.error('Erro ao atualizar assinatura:', updateError);
        return new Response(JSON.stringify({ error: 'Failed to update subscription' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
