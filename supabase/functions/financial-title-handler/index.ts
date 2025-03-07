
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { Stripe } from 'https://esm.sh/stripe@13.10.0'

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentIntentPayload {
  id: string;
  organizationId?: string;
  status: string;
  paymentStatusDetails?: string;
  paymentMethod?: string;
}

interface InvoicePayload {
  subscription: string;
  payment_intent: string;
  amount_paid: number;
  last_payment_error?: {
    code?: string;
  };
  next_payment_attempt?: number;
}

// Update title status to paid
export async function markTitleAsPaid(titleId: string, paymentMethod: string, paymentIntentId?: string): Promise<boolean> {
  console.log(`Marking title ${titleId} as paid with method ${paymentMethod}`);
  
  const { error } = await supabase
    .from('financial_titles')
    .update({
      status: 'paid',
      payment_date: new Date().toISOString(),
      payment_method: paymentMethod,
      ...(paymentIntentId && { stripe_payment_intent_id: paymentIntentId })
    })
    .eq('id', titleId);
  
  if (error) {
    console.error('Error marking title as paid:', error);
    return false;
  }
  
  console.log(`Title ${titleId} successfully marked as paid`);
  return true;
}

// Update title status to overdue with details
export async function markTitleAsOverdue(titleId: string, paymentStatusDetails: string): Promise<boolean> {
  console.log(`Marking title ${titleId} as overdue with details: ${paymentStatusDetails}`);
  
  const { error } = await supabase
    .from('financial_titles')
    .update({
      status: 'overdue',
      payment_status_details: paymentStatusDetails
    })
    .eq('id', titleId);
  
  if (error) {
    console.error('Error marking title as overdue:', error);
    return false;
  }
  
  console.log(`Title ${titleId} successfully marked as overdue`);
  return true;
}

// Find financial title by payment intent ID
export async function findTitleByPaymentIntent(paymentIntentId: string) {
  console.log(`Looking for title with payment intent ID: ${paymentIntentId}`);
  
  const { data: title, error } = await supabase
    .from('financial_titles')
    .select('*')
    .eq('stripe_payment_intent_id', paymentIntentId)
    .single();
  
  if (error) {
    console.error('Error finding title by payment intent:', error);
    return null;
  }
  
  console.log(`Found title: ${title?.id}`);
  return title;
}

// Find pending monthly title for organization
export async function findPendingMonthlyTitle(organizationId: string) {
  console.log(`Looking for pending monthly title for organization: ${organizationId}`);
  
  const { data: titles, error } = await supabase
    .from('financial_titles')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('type', 'mensalidade')
    .eq('status', 'pending')
    .order('due_date', { ascending: true })
    .limit(1);
  
  if (error) {
    console.error('Error finding pending monthly title:', error);
    return null;
  }
  
  if (titles && titles.length > 0) {
    console.log(`Found pending monthly title: ${titles[0].id}`);
    return titles[0];
  }
  
  console.log('No pending monthly title found');
  return null;
}

// Create a new paid monthly title
export async function createPaidMonthlyTitle(
  organizationId: string, 
  amount: number, 
  paymentIntentId: string
): Promise<boolean> {
  console.log(`Creating paid monthly title for organization: ${organizationId}`);
  
  // Set reference month (current month)
  const today = new Date();
  const referenceMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  
  // Set due date to 1st of current month
  const dueDate = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const { error } = await supabase
    .from('financial_titles')
    .insert({
      organization_id: organizationId,
      type: 'mensalidade',
      value: amount,
      due_date: dueDate.toISOString(),
      status: 'paid',
      payment_date: today.toISOString(),
      payment_method: 'credit_card',
      stripe_payment_intent_id: paymentIntentId,
      reference_month: referenceMonth
    });
  
  if (error) {
    console.error('Error creating paid monthly title:', error);
    return false;
  }
  
  console.log('Paid monthly title created successfully');
  return true;
}

// Handle payment intent succeeded event
export async function handlePaymentIntentSucceeded(paymentIntent: PaymentIntentPayload): Promise<boolean> {
  console.log('Handling payment intent succeeded:', paymentIntent.id);
  
  const title = await findTitleByPaymentIntent(paymentIntent.id);
  
  if (title) {
    return await markTitleAsPaid(title.id, 'credit_card');
  }
  
  return false;
}

// Handle invoice payment succeeded event
export async function handleInvoicePaymentSucceeded(
  invoice: InvoicePayload,
  subscriptionData: { organization_id: string, status: string }
): Promise<boolean> {
  console.log('Handling invoice payment succeeded for subscription:', invoice.subscription);
  
  const title = await findPendingMonthlyTitle(subscriptionData.organization_id);
  
  if (title) {
    // Update existing title to paid
    return await markTitleAsPaid(title.id, 'credit_card', invoice.payment_intent);
  } else {
    // Create new paid title to track payment history
    const amountPaid = invoice.amount_paid / 100; // Convert from cents
    return await createPaidMonthlyTitle(subscriptionData.organization_id, amountPaid, invoice.payment_intent);
  }
}

// Handle invoice payment failed event
export async function handleInvoicePaymentFailed(
  invoice: InvoicePayload,
  subscriptionData: { organization_id: string }
): Promise<boolean> {
  console.log('Handling invoice payment failed for subscription:', invoice.subscription);
  
  const title = await findPendingMonthlyTitle(subscriptionData.organization_id);
  
  if (title) {
    // Get payment status details
    let paymentStatusDetails = 'payment_failed';
    if (invoice.last_payment_error?.code) {
      paymentStatusDetails = invoice.last_payment_error.code;
    } else if (invoice.next_payment_attempt) {
      paymentStatusDetails = 'retry_scheduled';
    }
    
    // Update title to overdue with status details
    return await markTitleAsOverdue(title.id, paymentStatusDetails);
  }
  
  return false;
}

// Handle subscription status change
export async function handleSubscriptionStatusChange(
  status: string,
  organizationId: string
): Promise<boolean> {
  if (status === 'past_due' || status === 'incomplete' || status === 'incomplete_expired') {
    console.log(`Handling subscription status change to ${status} for organization ${organizationId}`);
    
    const title = await findPendingMonthlyTitle(organizationId);
    
    if (title) {
      return await markTitleAsOverdue(title.id, status);
    }
  }
  
  return false;
}

// Main handler function
Deno.serve(async (req) => {
  try {
    // Handle CORS preflight request
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    // Parse request body
    const requestData = await req.json();
    
    console.log('Received request:', JSON.stringify(requestData));
    
    let result = false;
    
    // Process based on action type
    switch (requestData.action) {
      case 'payment_intent_succeeded':
        result = await handlePaymentIntentSucceeded(requestData.payload);
        break;
        
      case 'invoice_payment_succeeded':
        result = await handleInvoicePaymentSucceeded(requestData.payload, requestData.subscription);
        break;
        
      case 'invoice_payment_failed':
        result = await handleInvoicePaymentFailed(requestData.payload, requestData.subscription);
        break;
        
      case 'subscription_status_change':
        result = await handleSubscriptionStatusChange(
          requestData.payload.status,
          requestData.payload.organizationId
        );
        break;
        
      default:
        return new Response(
          JSON.stringify({ success: false, error: 'Unknown action type' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }
    
    return new Response(
      JSON.stringify({ success: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
