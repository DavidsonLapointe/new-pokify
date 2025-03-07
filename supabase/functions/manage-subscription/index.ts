
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

interface CreateSubscriptionBody {
  organizationId: string;
  paymentMethodId: string;
  priceId: string;
}

interface CreateSetupIntentBody {
  action: string;
  organizationId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    console.log('Requisição recebida:', JSON.stringify(requestBody));
    
    // Handle create_setup_intent action
    if (requestBody.action === 'create_setup_intent') {
      console.log('Criando setup intent para organização:', requestBody.organizationId);
      return await handleCreateSetupIntent(requestBody);
    }
    
    // Handle create subscription action (default)
    const { organizationId, paymentMethodId, priceId } = requestBody as CreateSubscriptionBody;
    return await handleCreateSubscription(organizationId, paymentMethodId, priceId);
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Handle setup intent creation
async function handleCreateSetupIntent(body: CreateSetupIntentBody) {
  try {
    const { organizationId } = body;
    console.log('Processando setup intent para organização ID:', organizationId);
    
    // Buscar informações da organização
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .single();

    if (orgError || !organization) {
      console.error('Organização não encontrada:', orgError);
      throw new Error('Organização não encontrada');
    }

    console.log('Organização encontrada:', organization.name);

    // Verificar se já existe um cliente no Stripe para esta organização
    let customerId = null;
    
    // Verificar primeiro se existe uma assinatura para esta organização
    const { data: subscriptions, error: subError } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id, status')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });
      
    if (!subError && subscriptions && subscriptions.length > 0) {
      console.log('Assinaturas encontradas:', subscriptions.length);
      
      // Priorizar assinaturas ativas ou com customer_id definido que não seja 'pending'
      const validSubscription = subscriptions.find(
        sub => sub.stripe_customer_id && sub.stripe_customer_id !== 'pending'
      );
      
      if (validSubscription) {
        console.log('Assinatura com customer ID válido encontrada:', validSubscription.stripe_customer_id);
        customerId = validSubscription.stripe_customer_id;
      } else {
        console.log('Nenhuma assinatura com customer ID válido encontrada');
      }
    } else {
      console.log('Nenhuma assinatura encontrada ou erro ao buscar:', subError);
    }
    
    // Se não encontrou customer_id nas assinaturas, tentar buscar por metadata
    if (!customerId) {
      console.log('Buscando cliente pelo metadata...');
      
      try {
        const existingCustomers = await stripe.customers.search({
          query: `metadata['organization_id']:'${organizationId}'`,
        });

        if (existingCustomers.data.length > 0) {
          customerId = existingCustomers.data[0].id;
          console.log('Cliente Stripe existente encontrado via metadata:', customerId);
        }
      } catch (stripeError) {
        console.error('Erro ao buscar cliente Stripe via metadata:', stripeError);
        // Vamos continuar e criar um novo cliente se necessário
      }
    }
    
    // Se ainda não encontrou customer_id, criar um novo cliente
    if (!customerId) {
      // Criar novo cliente
      console.log('Criando novo cliente Stripe para:', organization.admin_email || organization.email);
      try {
        const customer = await stripe.customers.create({
          email: organization.admin_email || organization.email,
          name: organization.name,
          metadata: {
            organization_id: organizationId,
          },
        });
        customerId = customer.id;
        console.log('Novo cliente Stripe criado:', customerId);
        
        // Atualizar a assinatura inativa com o customer ID se ela existir
        if (subscriptions && subscriptions.length > 0) {
          console.log('Atualizando assinatura(s) com o novo customer ID');
          
          // Pegamos todas as assinaturas inativas ou com customer_id pendente
          const inactiveSubscriptions = subscriptions.filter(
            sub => sub.status === 'inactive' || !sub.stripe_customer_id || sub.stripe_customer_id === 'pending'
          );
          
          if (inactiveSubscriptions.length > 0) {
            for (const sub of inactiveSubscriptions) {
              const { error: updateError } = await supabase
                .from('subscriptions')
                .update({ stripe_customer_id: customerId })
                .eq('organization_id', organizationId)
                .eq('status', 'inactive');
                
              if (updateError) {
                console.error('Erro ao atualizar assinatura com customer ID:', updateError);
              } else {
                console.log('Assinatura atualizada com o novo customer ID');
              }
            }
          }
        } else {
          // Criar uma nova assinatura inativa se não existe
          console.log('Nenhuma assinatura encontrada, criando assinatura inativa...');
          const { error: insertError } = await supabase
            .from('subscriptions')
            .insert({
              organization_id: organizationId,
              stripe_customer_id: customerId,
              stripe_subscription_id: 'pending',
              status: 'inactive',
            });
            
          if (insertError) {
            console.error('Erro ao criar assinatura inativa:', insertError);
          } else {
            console.log('Assinatura inativa criada com sucesso');
          }
        }
      } catch (createError) {
        console.error('Erro ao criar cliente Stripe:', createError);
        throw new Error('Erro ao criar cliente no Stripe');
      }
    }

    if (!customerId) {
      throw new Error('Não foi possível obter ou criar o ID do cliente Stripe');
    }

    // Criar o setup intent
    console.log('Criando setup intent para cliente:', customerId);
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
      usage: 'off_session',
    });

    console.log('Setup intent criado com sucesso, client_secret:', setupIntent.client_secret?.substring(0, 10) + '...');

    return new Response(
      JSON.stringify({
        clientSecret: setupIntent.client_secret,
        customerId: customerId,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Erro ao criar setup intent:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}

// Handle subscription creation
async function handleCreateSubscription(organizationId: string, paymentMethodId: string, priceId: string) {
  try {
    // Buscar informações da organização
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .single();

    if (orgError || !organization) {
      throw new Error('Organização não encontrada');
    }

    console.log('Organizacao encontrada:', organization.name);

    // Verificar se já existe uma assinatura inativa
    const { data: existingInactiveSubscription, error: subCheckError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('status', 'inactive')
      .single();

    if (subCheckError) {
      console.error('Erro ao verificar assinatura inativa:', subCheckError);
      console.log('Criando nova assinatura inativa...');
      
      // Criar assinatura inativa
      const { data: newSubscription, error: createError } = await supabase
        .from('subscriptions')
        .insert({
          organization_id: organizationId,
          stripe_subscription_id: 'pending',
          stripe_customer_id: 'pending',
          status: 'inactive',
        })
        .select()
        .single();
        
      if (createError) {
        console.error('Erro ao criar assinatura inativa:', createError);
        throw new Error('Erro ao criar assinatura inativa');
      }
      
      console.log('Nova assinatura inativa criada:', newSubscription.id);
    } else {
      console.log('Assinatura inativa encontrada:', existingInactiveSubscription.id);
    }

    // Criar ou recuperar o cliente no Stripe
    let customer;
    const existingCustomers = await stripe.customers.search({
      query: `metadata['organization_id']:'${organizationId}'`,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
      console.log('Cliente Stripe existente encontrado:', customer.id);
      
      // Atualizar o método de pagamento padrão
      await stripe.customers.update(customer.id, {
        default_payment_method: paymentMethodId,
      });
      console.log('Método de pagamento atualizado para o cliente:', paymentMethodId);
    } else {
      // Criar novo cliente
      console.log('Criando novo cliente Stripe...');
      customer = await stripe.customers.create({
        email: organization.email,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
        metadata: {
          organization_id: organizationId,
        },
      });
      console.log('Novo cliente Stripe criado:', customer.id);
    }

    // Criar a assinatura
    console.log('Criando assinatura no Stripe com preço:', priceId);
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_settings: {
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    });

    console.log('Assinatura Stripe criada com sucesso:', subscription.id);

    // Se existir uma assinatura inativa, atualizá-la
    const subscriptionToUpdate = existingInactiveSubscription || 
                               (await supabase.from('subscriptions')
                                 .select('*')
                                 .eq('organization_id', organizationId)
                                 .single()).data;
    
    if (subscriptionToUpdate) {
      console.log('Atualizando assinatura no Supabase:', subscriptionToUpdate.id);
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          stripe_subscription_id: subscription.id,
          stripe_customer_id: customer.id,
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq('id', subscriptionToUpdate.id);

      if (updateError) {
        console.error('Erro ao atualizar assinatura no Supabase:', updateError);
        throw updateError;
      }
      
      console.log('Assinatura atualizada com sucesso no Supabase');
    } else {
      // Caso não exista, criar uma nova assinatura
      console.log('Criando nova assinatura no Supabase...');
      const { error: subError } = await supabase
        .from('subscriptions')
        .insert({
          organization_id: organizationId,
          stripe_subscription_id: subscription.id,
          stripe_customer_id: customer.id,
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        });

      if (subError) {
        console.error('Erro ao criar nova assinatura no Supabase:', subError);
        throw subError;
      }
      
      console.log('Nova assinatura criada com sucesso no Supabase');
    }

    // Se a assinatura estiver ativa, atualizar o status da organização
    if (subscription.status === 'active') {
      console.log('Assinatura ativa, atualizando status da organização...');
      const { error: updateError } = await supabase
        .from('organizations')
        .update({
          status: 'active',
          pending_reason: null,
        })
        .eq('id', organizationId);

      if (updateError) {
        console.error('Erro ao atualizar status da organização:', updateError);
      } else {
        console.log('Status da organização atualizado com sucesso');
      }
    }

    return new Response(
      JSON.stringify({
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
        status: subscription.status,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Erro ao criar assinatura:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}
