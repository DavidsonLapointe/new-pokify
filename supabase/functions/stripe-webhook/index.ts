
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
