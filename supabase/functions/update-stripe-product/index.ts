
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
    console.log('Recebendo requisição para atualizar produto no Stripe');
    const { 
      stripeProductId, 
      stripePriceId,
      name, 
      description, 
      price,
      active,
      credits,
      returnIds = true // Nova opção para controlar se devemos retornar os IDs
    } = await req.json();

    console.log('Dados recebidos:', {
      stripeProductId,
      stripePriceId,
      name,
      description,
      price,
      active,
      credits,
      returnIds
    });

    let updatedProduct;
    let updatedPrice;

    // Se não tiver product ID, cria um novo produto
    if (!stripeProductId) {
      console.log('Criando novo produto no Stripe');
      
      try {
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
      } catch (error) {
        console.error('Erro ao criar produto/preço no Stripe:', error);
        throw new Error(`Erro ao criar produto/preço no Stripe: ${error.message}`);
      }
    } else {
      console.log('Atualizando produto existente:', stripeProductId);

      try {
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
        } else if (stripePriceId) {
          // Se não foi fornecido um novo preço, usa o preço existente
          console.log('Mantendo preço atual:', stripePriceId);
          
          const priceData = await stripe.prices.retrieve(stripePriceId);
          updatedPrice = priceData;
        }
      } catch (error) {
        console.error('Erro ao atualizar produto/preço no Stripe:', error);
        throw new Error(`Erro ao atualizar produto/preço no Stripe: ${error.message}`);
      }
    }

    // Preparar resposta conforme a opção returnIds
    let responseData = { success: true };
    
    if (returnIds && updatedProduct) {
      responseData = {
        ...responseData,
        product: updatedProduct,
        price: updatedPrice
      };
    }

    console.log('Resposta final:', responseData);

    return new Response(
      JSON.stringify(responseData),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Erro:', error)
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
