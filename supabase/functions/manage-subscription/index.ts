
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";
import Stripe from 'https://esm.sh/stripe@11.16.0?target=deno';

// Tipos para validação dos payloads
const CreateSubscriptionPayload = z.object({
  action: z.literal('create_subscription'),
  organizationId: z.string().uuid(),
  paymentMethodId: z.string(),
  priceId: z.string()
});

const CreateSetupIntentPayload = z.object({
  action: z.literal('create_setup_intent'),
  organizationId: z.string().uuid()
});

const CreateInactiveSubscriptionPayload = z.object({
  action: z.literal('create_inactive_subscription'),
  organizationId: z.string().uuid()
});

// União dos possíveis payloads
const ActionPayload = z.discriminatedUnion('action', [
  CreateSubscriptionPayload,
  CreateSetupIntentPayload,
  CreateInactiveSubscriptionPayload
]);

// Initialize Supabase client with service role key
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Initialize Stripe
const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Get and validate the request body
    const requestData = await req.json();
    console.log("Received request data:", JSON.stringify(requestData, null, 2));
    
    // Validate the payload against our schema
    const result = ActionPayload.safeParse(requestData);
    
    if (!result.success) {
      console.error("Invalid payload:", result.error);
      return new Response(
        JSON.stringify({ error: "Invalid request payload", details: result.error }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const payload = result.data;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle different actions based on the discriminated union
    if (payload.action === 'create_subscription') {
      return await handleCreateSubscription(payload, supabase, stripe, corsHeaders);
    } else if (payload.action === 'create_setup_intent') {
      return await handleCreateSetupIntent(payload, supabase, stripe, corsHeaders);
    } else if (payload.action === 'create_inactive_subscription') {
      return await handleCreateInactiveSubscription(payload, supabase, stripe, corsHeaders);
    }

    // Should never reach here due to zod validation
    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

async function handleCreateSubscription(
  payload: z.infer<typeof CreateSubscriptionPayload>,
  supabase: any,
  stripe: Stripe,
  corsHeaders: any
) {
  const { organizationId, paymentMethodId, priceId } = payload;
  
  try {
    // Get organization data
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .single();

    if (orgError) {
      throw new Error(`Error getting organization: ${orgError.message}`);
    }

    // Get or create Stripe customer
    let stripeCustomerId = organization.stripe_customer_id;
    
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: organization.email,
        name: organization.name,
        metadata: { organizationId }
      });
      
      stripeCustomerId = customer.id;
      
      // Update organization with Stripe customer ID
      await supabase
        .from('organizations')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', organizationId);
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: stripeCustomerId,
    });

    // Set as default payment method
    await stripe.customers.update(stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
    });

    // Update the subscription in the database
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscriptions')
      .update({
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        stripe_customer_id: stripeCustomerId
      })
      .eq('organization_id', organizationId)
      .select()
      .single();

    if (subscriptionError) {
      throw new Error(`Error updating subscription: ${subscriptionError.message}`);
    }

    // Get client secret from the subscription for frontend confirmation
    const invoice = subscription.latest_invoice;
    const clientSecret = invoice?.payment_intent?.client_secret || null;

    return new Response(
      JSON.stringify({
        subscriptionId: subscription.id,
        clientSecret,
        status: subscription.status
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating subscription:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
}

async function handleCreateSetupIntent(
  payload: z.infer<typeof CreateSetupIntentPayload>,
  supabase: any,
  stripe: Stripe,
  corsHeaders: any
) {
  const { organizationId } = payload;
  
  try {
    console.log(`Creating setup intent for organization: ${organizationId}`);
    
    // Get organization data
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .single();

    if (orgError) {
      throw new Error(`Error getting organization: ${orgError.message}`);
    }
    
    // Get or create Stripe customer
    let stripeCustomerId = organization.stripe_customer_id;
    
    if (!stripeCustomerId) {
      console.log(`Creating Stripe customer for organization: ${organizationId}`);
      
      const customer = await stripe.customers.create({
        email: organization.email,
        name: organization.name,
        metadata: { organizationId }
      });
      
      stripeCustomerId = customer.id;
      
      // Update organization with Stripe customer ID
      const { error: updateError } = await supabase
        .from('organizations')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', organizationId);
        
      if (updateError) {
        console.error(`Error updating organization with Stripe customer ID: ${updateError.message}`);
      } else {
        console.log(`Updated organization with Stripe customer ID: ${stripeCustomerId}`);
      }
    } else {
      console.log(`Using existing Stripe customer: ${stripeCustomerId}`);
    }

    // Create a SetupIntent to collect payment method
    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      usage: 'off_session',
    });
    
    console.log(`Created setup intent: ${setupIntent.id}`);

    return new Response(
      JSON.stringify({
        clientSecret: setupIntent.client_secret,
        customerId: stripeCustomerId
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating setup intent:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
}

async function handleCreateInactiveSubscription(
  payload: z.infer<typeof CreateInactiveSubscriptionPayload>,
  supabase: any,
  stripe: Stripe,
  corsHeaders: any
) {
  const { organizationId } = payload;
  
  try {
    console.log(`Creating inactive subscription for organization: ${organizationId}`);
    
    // Get organization data
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('name, email, admin_email, admin_name')
      .eq('id', organizationId)
      .single();

    if (orgError) {
      throw new Error(`Error getting organization: ${orgError.message}`);
    }
    
    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: organization.email,
      name: organization.name,
      metadata: { organizationId }
    });
    
    console.log(`Created Stripe customer: ${customer.id}`);
    
    // Update organization with Stripe customer ID
    const { error: updateError } = await supabase
      .from('organizations')
      .update({ stripe_customer_id: customer.id })
      .eq('id', organizationId);
      
    if (updateError) {
      console.error(`Error updating organization with Stripe customer ID: ${updateError.message}`);
    }
    
    // Create inactive subscription record
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .insert({
        organization_id: organizationId,
        stripe_customer_id: customer.id,
        status: 'inactive',
        stripe_subscription_id: 'pending_activation'
      })
      .select()
      .single();

    if (subError) {
      throw new Error(`Error creating subscription record: ${subError.message}`);
    }
    
    console.log(`Created inactive subscription record: ${subscription.id}`);
    
    // Criar o perfil do usuário administrador com status pending
    const adminEmail = organization.admin_email;
    const adminName = organization.admin_name;
    
    console.log(`Criando perfil para administrador: ${adminEmail}`);
    
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        email: adminEmail,
        name: adminName,
        role: 'admin',
        status: 'pending',
        organization_id: organizationId,
        permissions: {
          manage_users: true,
          manage_integrations: true,
          access_calls: true,
          manage_leads: true
        }
      })
      .select()
      .single();
      
    if (profileError) {
      console.error(`Erro ao criar perfil de administrador: ${profileError.message}`);
      console.error(profileError);
      
      // Não vamos falhar completamente se o perfil não for criado
      // A criação do usuário será tentada novamente durante o processo de confirmação
    } else {
      console.log(`Perfil de administrador criado com sucesso: ${profileData.email}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        subscription: {
          id: subscription.id,
          organizationId: subscription.organization_id,
          status: subscription.status,
          stripeCustomerId: subscription.stripe_customer_id,
          createdAt: subscription.created_at
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating inactive subscription:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
}
