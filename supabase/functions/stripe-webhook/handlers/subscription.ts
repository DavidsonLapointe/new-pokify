
import { Stripe } from 'https://esm.sh/stripe@13.10.0'
import { createSupabaseClient, invokeFinancialTitleHandler } from '../utils.ts'

// Handler for customer.subscription.updated events
export async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);
  const supabase = createSupabaseClient();
  
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
    
    // Call financial-title-handler for subscription status change
    await invokeFinancialTitleHandler('subscription_status_change', {
      status: subscription.status,
      organizationId: supabaseSubscription.organization_id
    });
  }
}

// Handler for customer.subscription.deleted events
export async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);
  const supabase = createSupabaseClient();
  
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
