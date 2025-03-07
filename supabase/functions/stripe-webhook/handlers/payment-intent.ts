
import { Stripe } from 'https://esm.sh/stripe@13.10.0'
import { invokeFinancialTitleHandler } from '../utils.ts'

// Handler for payment_intent.succeeded events
export async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment intent succeeded:', paymentIntent.id);
  
  // Call financial-title-handler Edge Function
  await invokeFinancialTitleHandler('payment_intent_succeeded', {
    id: paymentIntent.id,
  });
}
