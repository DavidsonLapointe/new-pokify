
import { serve } from 'https://deno.fresh.dev/std@v9.6.1/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import Stripe from 'https://esm.sh/stripe@13.6.0?target=deno';

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
  titleId: string;
  paymentMethod: 'pix' | 'boleto';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { titleId, paymentMethod } = await req.json() as RequestBody;

    // Busca o título financeiro
    const { data: title, error: titleError } = await supabase
      .from('financial_titles')
      .select('*, organization:organizations(name, email)')
      .eq('id', titleId)
      .single();

    if (titleError || !title) {
      throw new Error('Título não encontrado');
    }

    // Cria o PaymentIntent no Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(title.value * 100), // Stripe trabalha com centavos
      currency: 'brl',
      payment_method_types: [paymentMethod],
      metadata: {
        titleId: title.id,
        organizationId: title.organization_id
      }
    });

    // Atualiza o título com o ID do PaymentIntent
    await supabase
      .from('financial_titles')
      .update({
        stripe_payment_intent_id: paymentIntent.id,
      })
      .eq('id', titleId);

    let paymentDetails = null;

    if (paymentMethod === 'pix') {
      const pixDetails = paymentIntent.next_action?.display_bank_transfer_instructions;
      paymentDetails = {
        qrCode: pixDetails?.hosted_instructions_url,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
      };

      // Atualiza o título com os detalhes do PIX
      await supabase
        .from('financial_titles')
        .update({
          pix_qr_code: paymentDetails.qrCode,
          pix_expiration_date: paymentDetails.expiresAt
        })
        .eq('id', titleId);
    } else if (paymentMethod === 'boleto') {
      const boletoDetails = paymentIntent.next_action?.boleto_display_details;
      paymentDetails = {
        pdfUrl: boletoDetails?.hosted_voucher_url,
        barCode: boletoDetails?.number
      };

      // Atualiza o título com os detalhes do boleto
      await supabase
        .from('financial_titles')
        .update({
          boleto_url: paymentDetails.pdfUrl,
          boleto_barcode: paymentDetails.barCode
        })
        .eq('id', titleId);
    }

    return new Response(
      JSON.stringify({
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        paymentDetails
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
