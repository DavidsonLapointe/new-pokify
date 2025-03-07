
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

serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      return new Response('No signature', { status: 400 })
    }

    const body = await req.text()
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret!)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      // Atualizar o status da compra
      const { error: purchaseError } = await supabase
        .from('credit_purchases')
        .update({ status: 'completed' })
        .eq('stripe_payment_intent_id', session.payment_intent);

      if (purchaseError) throw purchaseError;

      // Atualizar o saldo de créditos
      const { data: balance, error: balanceError } = await supabase
        .from('credit_balances')
        .select('*')
        .eq('organization_id', session.metadata?.organizationId)
        .single();

      if (balanceError && balanceError.code !== 'PGRST116') {
        throw balanceError;
      }

      const credits = parseInt(session.metadata?.credits ?? '0');

      if (balance) {
        // Atualizar saldo existente
        const { error } = await supabase
          .from('credit_balances')
          .update({
            total_credits: balance.total_credits + credits
          })
          .eq('organization_id', session.metadata?.organizationId);

        if (error) throw error;
      } else {
        // Criar novo registro de saldo
        const { error } = await supabase
          .from('credit_balances')
          .insert({
            organization_id: session.metadata?.organizationId,
            total_credits: credits,
            used_credits: 0
          });

        if (error) throw error;
      }
    }
    else if (event.type === 'payment_intent.succeeded') {
      // Novo tratamento para pagamentos processados com sucesso
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      console.log('Payment intent succeeded:', paymentIntent.id);
      
      // Verificar se há um título financeiro associado a este pagamento
      const { data: financialTitle, error: titleError } = await supabase
        .from('financial_titles')
        .select('*')
        .eq('stripe_payment_intent_id', paymentIntent.id)
        .single();
      
      if (titleError) {
        console.error('Erro ao buscar título financeiro:', titleError);
      } else if (financialTitle) {
        console.log('Título financeiro encontrado:', financialTitle.id);
        
        // Atualizar o status do título para 'paid'
        const { error: updateError } = await supabase
          .from('financial_titles')
          .update({
            status: 'paid',
            payment_date: new Date().toISOString(),
            payment_method: 'credit_card'
          })
          .eq('id', financialTitle.id);
        
        if (updateError) {
          console.error('Erro ao atualizar título:', updateError);
        } else {
          console.log('Título atualizado com sucesso:', financialTitle.id);
        }
      }
    }
    else if (event.type === 'invoice.payment_succeeded') {
      // Processamento de faturas pagas (para assinaturas)
      const invoice = event.data.object as Stripe.Invoice;
      
      if (invoice.subscription) {
        console.log('Invoice payment succeeded for subscription:', invoice.subscription);
        
        // Buscar a assinatura no nosso banco
        const { data: subscription, error: subscriptionError } = await supabase
          .from('subscriptions')
          .select('organization_id')
          .eq('stripe_subscription_id', invoice.subscription)
          .single();
        
        if (subscriptionError) {
          console.error('Erro ao buscar assinatura:', subscriptionError);
        } else if (subscription) {
          console.log('Assinatura encontrada para organização:', subscription.organization_id);
          
          // Verificar se há título de mensalidade pendente para esta organização
          const { data: titles, error: titlesError } = await supabase
            .from('financial_titles')
            .select('*')
            .eq('organization_id', subscription.organization_id)
            .eq('type', 'mensalidade')
            .eq('status', 'pending')
            .order('due_date', { ascending: true })
            .limit(1);
          
          if (titlesError) {
            console.error('Erro ao buscar títulos:', titlesError);
          } else if (titles && titles.length > 0) {
            const title = titles[0];
            console.log('Título de mensalidade encontrado:', title.id);
            
            // Atualizar o título para pago
            const { error: updateError } = await supabase
              .from('financial_titles')
              .update({
                status: 'paid',
                payment_date: new Date().toISOString(),
                payment_method: 'credit_card',
                stripe_payment_intent_id: invoice.payment_intent
              })
              .eq('id', title.id);
            
            if (updateError) {
              console.error('Erro ao atualizar título:', updateError);
            } else {
              console.log('Título de mensalidade atualizado com sucesso:', title.id);
            }
          } else {
            console.log('Nenhum título de mensalidade pendente encontrado para esta organização');
          }
        }
      }
    }
    else if (event.type === 'invoice.payment_failed') {
      // Processamento de faturas com pagamento falho
      const invoice = event.data.object as Stripe.Invoice;
      
      if (invoice.subscription) {
        console.log('Invoice payment failed for subscription:', invoice.subscription);
        
        // Buscar a assinatura no nosso banco
        const { data: subscription, error: subscriptionError } = await supabase
          .from('subscriptions')
          .select('organization_id')
          .eq('stripe_subscription_id', invoice.subscription)
          .single();
        
        if (subscriptionError) {
          console.error('Erro ao buscar assinatura:', subscriptionError);
        } else if (subscription) {
          console.log('Assinatura encontrada para organização:', subscription.organization_id);
          
          // Verificar se há título de mensalidade pendente para esta organização
          const { data: titles, error: titlesError } = await supabase
            .from('financial_titles')
            .select('*')
            .eq('organization_id', subscription.organization_id)
            .eq('type', 'mensalidade')
            .eq('status', 'pending')
            .order('due_date', { ascending: true })
            .limit(1);
          
          if (titlesError) {
            console.error('Erro ao buscar títulos:', titlesError);
          } else if (titles && titles.length > 0) {
            const title = titles[0];
            console.log('Título de mensalidade encontrado:', title.id);
            
            // Atualizar o título para vencido
            const { error: updateError } = await supabase
              .from('financial_titles')
              .update({
                status: 'overdue'
              })
              .eq('id', title.id);
            
            if (updateError) {
              console.error('Erro ao atualizar título para vencido:', updateError);
            } else {
              console.log('Título de mensalidade marcado como vencido:', title.id);
            }
          }
        }
      }
    }
    else if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription;
      
      // Buscar a assinatura no Supabase pelo stripe_subscription_id
      const { data: supabaseSubscription, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('stripe_subscription_id', subscription.id)
        .single();
      
      if (fetchError) {
        console.error('Erro ao buscar assinatura:', fetchError);
        return new Response(JSON.stringify({ error: 'Subscription not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Atualizar informações da assinatura
      const updateData: any = {
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      };
      
      // Se estiver cancelada, atualizar as informações de cancelamento
      if (subscription.cancel_at_period_end) {
        updateData.status = 'canceled';
        if (subscription.cancel_at) {
          updateData.cancel_at = new Date(subscription.cancel_at * 1000).toISOString();
        }
        if (!supabaseSubscription.canceled_at) {
          updateData.canceled_at = new Date().toISOString();
        }
      }
      
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update(updateData)
        .eq('id', supabaseSubscription.id);
      
      if (updateError) {
        console.error('Erro ao atualizar assinatura:', updateError);
        return new Response(JSON.stringify({ error: 'Failed to update subscription' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    else if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      
      // Buscar a assinatura no Supabase pelo stripe_subscription_id
      const { data: supabaseSubscription, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('stripe_subscription_id', subscription.id)
        .single();
      
      if (fetchError) {
        console.error('Erro ao buscar assinatura:', fetchError);
        return new Response(JSON.stringify({ error: 'Subscription not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Marcar a assinatura como cancelada
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          canceled_at: new Date().toISOString(),
        })
        .eq('id', supabaseSubscription.id);
      
      if (updateError) {
        console.error('Erro ao atualizar assinatura:', updateError);
        return new Response(JSON.stringify({ error: 'Failed to update subscription' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

