
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

    let updatedProduct;
    let updatedPrice;

    // Se não tiver product ID, cria um novo produto
    if (!stripeProductId) {
      console.log('Criando novo produto no Stripe');
      
      // Criar o produto no Stripe
      updatedProduct = await stripe.products.create({
        name,
        description,
        active: active !== undefined ? active : true,
        metadata: {
          credits: credits?.toString(),
          type: credits ? 'additional_credits' : 'subscription'
        }
      });
      
      console.log('Produto criado com sucesso:', updatedProduct.id);
      
      // Criar preço para o produto
      updatedPrice = await stripe.prices.create({
        product: updatedProduct.id,
        unit_amount: Math.round(price * 100), // Converte para centavos
        currency: 'brl',
        active: active !== undefined ? active : true,
        metadata: {
          credits: credits?.toString()
        }
      });
      
      console.log('Preço criado com sucesso:', updatedPrice.id);
    } else {
      console.log('Atualizando produto existente:', stripeProductId);

      // Atualiza o produto
      updatedProduct = await stripe.products.update(stripeProductId, {
        name,
        description,
        active,
        metadata: {
          credits: credits?.toString(),
          type: credits ? 'additional_credits' : 'subscription'
        }
      });
      
      console.log('Produto atualizado com sucesso');

      // Criar novo preço se houver mudança no valor ou se não existir um preço
      if (price) {
        console.log('Criando novo preço para o produto');
        
        updatedPrice = await stripe.prices.create({
          product: stripeProductId,
          unit_amount: Math.round(price * 100), // Converte para centavos
          currency: 'brl',
          active: active !== undefined ? active : true,
          metadata: {
            credits: credits?.toString()
          }
        });
        
        console.log('Novo preço criado com sucesso:', updatedPrice.id);

        // Desativa o preço anterior
        if (stripePriceId) {
          console.log('Desativando preço anterior:', stripePriceId);
          
          await stripe.prices.update(stripePriceId, {
            active: false
          });
          
          console.log('Preço anterior desativado com sucesso');
        }
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
      JSON.stringify({ 
        success: false,
        error: error.message 
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
