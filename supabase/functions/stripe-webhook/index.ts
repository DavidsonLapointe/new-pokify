
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

// CORS headers for the Stripe webhook
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handler for checkout.session.completed events
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout.session.completed:', session.id);
  
  // Update purchase status
  const { error: purchaseError } = await supabase
    .from('credit_purchases')
    .update({ status: 'completed' })
    .eq('stripe_payment_intent_id', session.payment_intent);

  if (purchaseError) throw purchaseError;

  // Update credit balance
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
    // Update existing balance
    const { error } = await supabase
      .from('credit_balances')
      .update({
        total_credits: balance.total_credits + credits
      })
      .eq('organization_id', session.metadata?.organizationId);

    if (error) throw error;
  } else {
    // Create new balance record
    const { error } = await supabase
      .from('credit_balances')
      .insert({
        organization_id: session.metadata?.organizationId,
        total_credits: credits,
        used_credits: 0
      });

    if (error) throw error;
  }
  
  console.log(`Credits updated for organization ${session.metadata?.organizationId}: +${credits}`);
}

// Handler for payment_intent.succeeded events
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment intent succeeded:', paymentIntent.id);
  
  // Check for associated financial title
  const { data: financialTitle, error: titleError } = await supabase
    .from('financial_titles')
    .select('*')
    .eq('stripe_payment_intent_id', paymentIntent.id)
    .single();
  
  if (titleError) {
    console.error('Error finding financial title:', titleError);
    return;
  } 
  
  if (financialTitle) {
    console.log('Financial title found:', financialTitle.id);
    
    // Update title status to paid
    const { error: updateError } = await supabase
      .from('financial_titles')
      .update({
        status: 'paid',
        payment_date: new Date().toISOString(),
        payment_method: 'credit_card'
      })
      .eq('id', financialTitle.id);
    
    if (updateError) {
      console.error('Error updating title:', updateError);
    } else {
      console.log('Title updated successfully:', financialTitle.id);
    }
  }
}

// Handler for invoice.payment_succeeded events
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;
  
  console.log('Invoice payment succeeded for subscription:', invoice.subscription);
  
  // Find subscription in database
  const { data: subscription, error: subscriptionError } = await supabase
    .from('subscriptions')
    .select('organization_id, status')
    .eq('stripe_subscription_id', invoice.subscription)
    .single();
  
  if (subscriptionError) {
    console.error('Error finding subscription:', subscriptionError);
    return;
  }
  
  if (!subscription) {
    console.error('Subscription not found:', invoice.subscription);
    return;
  }
  
  console.log('Subscription found for organization:', subscription.organization_id);
  
  // Get organization data
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('plan, name')
    .eq('id', subscription.organization_id)
    .single();
    
  if (orgError) {
    console.error('Error finding organization:', orgError);
  }
  
  // Check for pending monthly title
  const { data: titles, error: titlesError } = await supabase
    .from('financial_titles')
    .select('*')
    .eq('organization_id', subscription.organization_id)
    .eq('type', 'mensalidade')
    .eq('status', 'pending')
    .order('due_date', { ascending: true })
    .limit(1);
  
  if (titlesError) {
    console.error('Error finding financial titles:', titlesError);
    return;
  }
  
  if (titles && titles.length > 0) {
    // Update existing title to paid
    const title = titles[0];
    console.log('Monthly title found:', title.id);
    
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
      console.error('Error updating title:', updateError);
    } else {
      console.log('Monthly title updated successfully:', title.id);
    }
  } else {
    // Create new paid title to track payment history
    console.log('No pending monthly title found - creating new title');
    
    if (organization && subscription.status === 'active') {
      const amountPaid = invoice.amount_paid / 100; // Convert from cents
      
      // Set reference month (current month)
      const today = new Date();
      const referenceMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
      
      // Set due date to 1st of current month
      const dueDate = new Date(today.getFullYear(), today.getMonth(), 1);
      
      // Create paid financial title
      const { error: createError } = await supabase
        .from('financial_titles')
        .insert({
          organization_id: subscription.organization_id,
          type: 'mensalidade',
          value: amountPaid,
          due_date: dueDate.toISOString(),
          status: 'paid',
          payment_date: today.toISOString(),
          payment_method: 'credit_card',
          stripe_payment_intent_id: invoice.payment_intent,
          reference_month: referenceMonth
        });
        
      if (createError) {
        console.error('Error creating financial title:', createError);
      } else {
        console.log('Financial title created for subscription payment');
      }
    }
  }
  
  // Activate subscription if needed
  if (subscription.status !== 'active') {
    const { error: updateSubError } = await supabase
      .from('subscriptions')
      .update({ status: 'active' })
      .eq('stripe_subscription_id', invoice.subscription);
      
    if (updateSubError) {
      console.error('Error updating subscription status:', updateSubError);
    } else {
      console.log('Subscription activated');
    }
  }
}

// Handler for invoice.payment_failed events
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;
  
  console.log('Invoice payment failed for subscription:', invoice.subscription);
  
  // Find subscription in database
  const { data: subscription, error: subscriptionError } = await supabase
    .from('subscriptions')
    .select('organization_id')
    .eq('stripe_subscription_id', invoice.subscription)
    .single();
  
  if (subscriptionError) {
    console.error('Error finding subscription:', subscriptionError);
    return;
  }
  
  if (!subscription) {
    console.error('Subscription not found:', invoice.subscription);
    return;
  }
  
  console.log('Subscription found for organization:', subscription.organization_id);
  
  // Check for pending monthly title
  const { data: titles, error: titlesError } = await supabase
    .from('financial_titles')
    .select('*')
    .eq('organization_id', subscription.organization_id)
    .eq('type', 'mensalidade')
    .eq('status', 'pending')
    .order('due_date', { ascending: true })
    .limit(1);
  
  if (titlesError) {
    console.error('Error finding financial titles:', titlesError);
    return;
  }
  
  if (titles && titles.length > 0) {
    const title = titles[0];
    console.log('Monthly title found:', title.id);
    
    // Get payment status details
    let paymentStatusDetails = 'payment_failed';
    if (invoice.last_payment_error?.code) {
      paymentStatusDetails = invoice.last_payment_error.code;
    } else if (invoice.next_payment_attempt) {
      paymentStatusDetails = 'retry_scheduled';
    }
    
    // Update title to overdue with status details
    const { error: updateError } = await supabase
      .from('financial_titles')
      .update({
        status: 'overdue',
        payment_status_details: paymentStatusDetails
      })
      .eq('id', title.id);
    
    if (updateError) {
      console.error('Error updating title to overdue:', updateError);
    } else {
      console.log('Title marked as overdue with details:', title.id, paymentStatusDetails);
    }
  }
}

// Handler for customer.subscription.updated events
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);
  
  // Find subscription in database
  const { data: supabaseSubscription, error: fetchError } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('stripe_subscription_id', subscription.id)
    .single();
  
  if (fetchError) {
    console.error('Error finding subscription:', fetchError);
    return;
  }
  
  // Prepare update data
  const updateData: any = {
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
  };
  
  // Handle cancellation
  if (subscription.cancel_at_period_end) {
    updateData.status = 'canceled';
    if (subscription.cancel_at) {
      updateData.cancel_at = new Date(subscription.cancel_at * 1000).toISOString();
    }
    if (!supabaseSubscription.canceled_at) {
      updateData.canceled_at = new Date().toISOString();
    }
  }
  
  // Update subscription
  const { error: updateError } = await supabase
    .from('subscriptions')
    .update(updateData)
    .eq('id', supabaseSubscription.id);
  
  if (updateError) {
    console.error('Error updating subscription:', updateError);
    return;
  }
  
  // Handle past due or incomplete statuses
  if (subscription.status === 'past_due' || subscription.status === 'incomplete' || 
      subscription.status === 'incomplete_expired') {
    
    // Look for pending financial title
    const { data: titles, error: titlesError } = await supabase
      .from('financial_titles')
      .select('*')
      .eq('organization_id', supabaseSubscription.organization_id)
      .eq('type', 'mensalidade')
      .eq('status', 'pending')
      .order('due_date', { ascending: true })
      .limit(1);
    
    if (titlesError) {
      console.error('Error finding financial titles:', titlesError);
      return;
    }
    
    if (titles && titles.length > 0) {
      const title = titles[0];
      console.log('Monthly title found for status update:', title.id);
      
      // Update title to overdue with subscription status details
      const { error: updateTitleError } = await supabase
        .from('financial_titles')
        .update({
          status: 'overdue',
          payment_status_details: subscription.status
        })
        .eq('id', title.id);
      
      if (updateTitleError) {
        console.error('Error updating title with subscription status:', updateTitleError);
      } else {
        console.log(`Title updated with status: overdue, details: ${subscription.status}`);
      }
    }
  }
}

// Handler for customer.subscription.deleted events
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);
  
  // Find subscription in database
  const { data: supabaseSubscription, error: fetchError } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('stripe_subscription_id', subscription.id)
    .single();
  
  if (fetchError) {
    console.error('Error finding subscription:', fetchError);
    return;
  }
  
  // Mark as canceled
  const { error: updateError } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
    })
    .eq('id', supabaseSubscription.id);
  
  if (updateError) {
    console.error('Error updating subscription:', updateError);
  } else {
    console.log('Subscription marked as canceled');
  }
}

// Main webhook handler
serve(async (req) => {
  try {
    // Handle CORS preflight request
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    // Verify Stripe signature
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response('No signature', { status: 400 });
    }

    const body = await req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!webhookSecret) {
      return new Response('Webhook secret not configured', { status: 500 });
    }
    
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log('Received Stripe event:', event.type);

    // Process event based on type
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
        
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
        
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
        
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
        
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
