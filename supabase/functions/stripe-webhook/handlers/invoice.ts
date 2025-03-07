
import { Stripe } from 'https://esm.sh/stripe@13.10.0'
import { createSupabaseClient, invokeFinancialTitleHandler } from '../utils.ts'

// Handler for invoice.payment_succeeded events
export async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;
  
  console.log('Invoice payment succeeded for subscription:', invoice.subscription);
  const supabase = createSupabaseClient();
  
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
  
  // Handle financial title via the Edge Function
  await invokeFinancialTitleHandler('invoice_payment_succeeded', invoice, subscription);
  
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
export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;
  
  console.log('Invoice payment failed for subscription:', invoice.subscription);
  const supabase = createSupabaseClient();
  
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
  
  // Handle financial title via the Edge Function
  await invokeFinancialTitleHandler('invoice_payment_failed', invoice, subscription);
}
