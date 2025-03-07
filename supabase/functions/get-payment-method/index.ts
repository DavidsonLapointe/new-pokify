
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import Stripe from "https://esm.sh/stripe@13.6.0?target=deno"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const supabase = createClient(supabaseUrl!, supabaseKey!);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  organizationId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { organizationId } = await req.json() as RequestBody;
    
    console.log(`Buscando método de pagamento para organização ${organizationId}`);

    // Buscar a assinatura ativa no Supabase para obter o customerId
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('organization_id', organizationId)
      .or('status.eq.active,status.eq.canceled')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (subError || !subscription) {
      console.log('Assinatura não encontrada:', subError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Assinatura não encontrada' 
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!subscription.stripe_customer_id || subscription.stripe_customer_id === 'pending') {
      console.log('Cliente Stripe não encontrado para esta assinatura');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Cliente Stripe não encontrado' 
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Buscar métodos de pagamento do cliente
    const paymentMethods = await stripe.paymentMethods.list({
      customer: subscription.stripe_customer_id,
      type: 'card',
    });

    if (!paymentMethods.data.length) {
      console.log('Nenhum método de pagamento encontrado para este cliente');
      return new Response(
        JSON.stringify({ 
          success: true, 
          paymentMethod: null 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Retornar o método de pagamento padrão (primeiro da lista)
    const defaultPaymentMethod = paymentMethods.data[0];
    const card = defaultPaymentMethod.card;

    if (!card) {
      throw new Error('Dados do cartão não disponíveis');
    }

    // Retornar os detalhes do método de pagamento
    return new Response(
      JSON.stringify({
        success: true,
        paymentMethod: {
          id: defaultPaymentMethod.id,
          brand: card.brand,
          last4: card.last4,
          expMonth: card.exp_month,
          expYear: card.exp_year,
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
