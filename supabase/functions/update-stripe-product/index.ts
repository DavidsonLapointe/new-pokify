
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Stripe } from 'https://esm.sh/stripe@13.10.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      stripeProductId, 
      stripePriceId,
      name, 
      description, 
      price,
      active,
      credits
    } = await req.json();

    console.log('Atualizando produto no Stripe:', {
      stripeProductId,
      stripePriceId,
      name,
      description,
      price,
      active,
      credits
    });

    // Atualiza o produto
    const updatedProduct = await stripe.products.update(stripeProductId, {
      name,
      description,
      active,
      metadata: {
        credits: credits?.toString()
      }
    });

    let updatedPrice;
    // Criar novo preço se houver mudança no valor
    if (price) {
      updatedPrice = await stripe.prices.create({
        product: stripeProductId,
        unit_amount: Math.round(price * 100), // Converte para centavos
        currency: 'brl',
        active: active,
        metadata: {
          credits: credits?.toString()
        }
      });

      // Desativa o preço anterior
      if (stripePriceId) {
        await stripe.prices.update(stripePriceId, {
          active: false
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        product: updatedProduct,
        price: updatedPrice
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
