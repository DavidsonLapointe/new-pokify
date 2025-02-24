
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Criar os produtos
    const basicProduct = await stripe.products.create({
      name: 'Basic',
      description: 'Ideal para pequenas empresas iniciando no mercado',
    });

    const professionalProduct = await stripe.products.create({
      name: 'Professional',
      description: 'Perfect para empresas em crescimento',
    });

    const enterpriseProduct = await stripe.products.create({
      name: 'Enterprise',
      description: 'Para grandes empresas que precisam de mais recursos',
    });

    // Criar os preços para cada produto
    const basicPrice = await stripe.prices.create({
      product: basicProduct.id,
      unit_amount: 9990, // R$ 99,90 em centavos
      currency: 'brl',
      recurring: {
        interval: 'month',
      },
    });

    const professionalPrice = await stripe.prices.create({
      product: professionalProduct.id,
      unit_amount: 19990, // R$ 199,90 em centavos
      currency: 'brl',
      recurring: {
        interval: 'month',
      },
    });

    const enterprisePrice = await stripe.prices.create({
      product: enterpriseProduct.id,
      unit_amount: 49990, // R$ 499,90 em centavos
      currency: 'brl',
      recurring: {
        interval: 'month',
      },
    });

    return new Response(
      JSON.stringify({
        basicPriceId: basicPrice.id,
        professionalPriceId: professionalPrice.id,
        enterprisePriceId: enterprisePrice.id,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
