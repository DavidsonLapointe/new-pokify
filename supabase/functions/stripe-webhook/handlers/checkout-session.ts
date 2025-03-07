
import { Stripe } from 'https://esm.sh/stripe@13.10.0'
import { createSupabaseClient } from '../utils.ts'

// Handler for checkout.session.completed events
export async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout.session.completed:', session.id);
  const supabase = createSupabaseClient();
  
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
