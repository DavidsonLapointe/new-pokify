
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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { organizationId, priceId } = await req.json()

    // Buscar o preço no Stripe para obter os detalhes
    const price = await stripe.prices.retrieve(priceId);
    const product = await stripe.products.retrieve(price.product as string);
    
    // Criar a sessão de pagamento
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/organization/plan?success=true`,
      cancel_url: `${req.headers.get('origin')}/organization/plan?success=false`,
      metadata: {
        organizationId,
        credits: product.metadata.credits,
        type: 'additional_credits'
      }
    });

    // Registrar a compra no banco
    const { data: purchase, error: purchaseError } = await supabase
      .from('credit_purchases')
      .insert({
        organization_id: organizationId,
        stripe_payment_intent_id: session.payment_intent,
        stripe_product_id: product.id,
        amount_cents: price.unit_amount,
        credits: parseInt(product.metadata.credits),
        status: 'pending'
      })
      .select()
      .single();

    if (purchaseError) {
      throw purchaseError;
    }

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        purchase: purchase
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      }
    )
  }
})
