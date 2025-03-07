
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

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verificar se é para criar produtos de planos ou pacotes de créditos
    const { type = 'credits', sync = false } = await req.json();
    
    let products;
    
    if (type === 'credits') {
      // Criar os produtos para pacotes de créditos avulsos
      products = [
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
    } else {
      // Criar os produtos para planos
      products = [
        {
          name: 'Plano Básico',
          description: 'Ideal para pequenas empresas iniciando no mercado',
          price: 4990, // R$ 49,90 em centavos
          features: ['Até 10 usuários', '500 créditos de análise por mês'],
          credits: 500,
        },
        {
          name: 'Plano Pro',
          description: 'Perfect para empresas em crescimento',
          price: 19990, // R$ 199,90 em centavos
          features: ['Usuários ilimitados', '1000 créditos de análise por mês'],
          credits: 1000,
        },
        {
          name: 'Plano Enterprise',
          description: 'Para grandes empresas que precisam de mais recursos',
          price: 69990, // R$ 699,90 em centavos
          features: ['Até 4 usuários', '100 créditos', 'Integrações avançadas'],
          credits: 120,
        }
      ];
    }

    const createdProducts = [];

    for (const product of products) {
      // Criar o produto no Stripe
      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.description,
        active: true,
        metadata: {
          credits: product.credits?.toString(),
          type: type === 'credits' ? 'additional_credits' : 'subscription'
        }
      });
      
      console.log('Produto criado com sucesso:', stripeProduct.id);
      
      // Criar preço para o produto
      const price = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: product.price,
        currency: 'brl',
        active: true,
        metadata: {
          credits: product.credits?.toString()
        }
      });
      
      console.log('Preço criado com sucesso:', price.id);

      createdProducts.push({
        product: stripeProduct,
        price: price
      });

      // Se a opção sync estiver habilitada, atualiza as tabelas do Supabase
      if (sync) {
        try {
          if (type === 'credits') {
            // Atualizar tabela analysis_packages
            const { data, error } = await supabase
              .from('analysis_packages')
              .insert([{
                name: product.name,
                description: product.description,
                credits: product.credits,
                price: product.price / 100, // Converter de centavos para reais
                active: true,
                stripe_product_id: stripeProduct.id,
                stripe_price_id: price.id
              }]);

            if (error) {
              console.error('Erro ao sincronizar pacote no Supabase:', error);
            } else {
              console.log('Pacote sincronizado com Supabase:', data);
            }
          } else {
            // Atualizar tabela plans
            const { data, error } = await supabase
              .from('plans')
              .insert([{
                name: product.name,
                description: product.description,
                price: product.price / 100, // Converter de centavos para reais
                features: product.features,
                credits: product.credits,
                active: true,
                stripe_product_id: stripeProduct.id,
                stripe_price_id: price.id
              }]);

            if (error) {
              console.error('Erro ao sincronizar plano no Supabase:', error);
            } else {
              console.log('Plano sincronizado com Supabase:', data);
            }
          }
        } catch (syncError) {
          console.error('Erro ao sincronizar produtos com Supabase:', syncError);
        }
      }
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
