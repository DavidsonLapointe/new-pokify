
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
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
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Criar os produtos para pacotes de créditos avulsos
    const products = [
      {
        name: 'Pacote Inicial',
        description: '100 créditos para análise de arquivos',
        credits: 100,
        price: 9990, // R$ 99,90 em centavos
      },
      {
        name: 'Pacote Plus',
        description: '500 créditos para análise de arquivos',
        credits: 500,
        price: 44990, // R$ 449,90 em centavos
      },
      {
        name: 'Pacote Enterprise',
        description: '1000 créditos para análise de arquivos',
        credits: 1000,
        price: 84990, // R$ 849,90 em centavos
      }
    ];

    const createdProducts = [];

    for (const product of products) {
      // Criar o produto no Stripe
      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.description,
        metadata: {
          credits: product.credits.toString(),
          type: 'additional_credits'
        },
      });

      // Criar o preço para o produto
      const price = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: product.price,
        currency: 'brl',
        metadata: {
          credits: product.credits.toString()
        }
      });

      createdProducts.push({
        product: stripeProduct,
        price: price
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        products: createdProducts
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
      JSON.stringify({
        error: error.message,
      }),
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
