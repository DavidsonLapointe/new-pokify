
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Iniciando setup do Stripe...');
    console.log('STRIPE_SECRET_KEY:', Deno.env.get('STRIPE_SECRET_KEY')?.slice(-10)); // Mostra apenas os últimos 10 caracteres por segurança

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    });

    console.log('Criando produtos no Stripe...');

    // Criar os produtos
    const basicProduct = await stripe.products.create({
      name: 'Pacote Básico',
      description: '100 créditos de análise',
      default_price_data: {
        currency: 'brl',
        unit_amount: 4990, // R$ 49,90
      },
      active: true,
    });

    console.log('Produto básico criado:', basicProduct.id);

    const proProduct = await stripe.products.create({
      name: 'Pacote Pro',
      description: '500 créditos de análise',
      default_price_data: {
        currency: 'brl',
        unit_amount: 19990, // R$ 199,90
      },
      active: true,
    });

    console.log('Produto pro criado:', proProduct.id);

    const enterpriseProduct = await stripe.products.create({
      name: 'Pacote Enterprise',
      description: '2000 créditos de análise',
      default_price_data: {
        currency: 'brl',
        unit_amount: 69990, // R$ 699,90
      },
      active: true,
    });

    console.log('Produto enterprise criado:', enterpriseProduct.id);

    const response = {
      basic: basicProduct,
      pro: proProduct,
      enterprise: enterpriseProduct
    };

    console.log('Todos os produtos criados com sucesso!');

    return new Response(
      JSON.stringify(response),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Erro ao criar produtos:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      }),
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
