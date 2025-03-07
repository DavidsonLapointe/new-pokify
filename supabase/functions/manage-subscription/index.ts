import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { Stripe } from 'https://esm.sh/stripe@13.10.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the request body
    const requestData = await req.json()
    const { action, organizationId, paymentMethodId, priceId } = requestData

    // Setup Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Setup Stripe client
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Create an inactive subscription (no Stripe interaction yet)
    if (action === 'create_inactive_subscription') {
      console.log('Creating inactive subscription for organization:', organizationId)
      
      // Check if an inactive subscription already exists
      const { data: existingSubscription, error: checkError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('status', 'inactive')
        .maybeSingle()
      
      if (checkError) {
        console.error('Error checking for existing subscriptions:', checkError)
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Failed to check for existing subscriptions',
            details: checkError
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
      
      // If subscription already exists, return it
      if (existingSubscription) {
        console.log('Inactive subscription already exists:', existingSubscription.id)
        return new Response(
          JSON.stringify({ 
            success: true,
            subscription: {
              id: existingSubscription.id,
              organizationId: existingSubscription.organization_id,
              stripeSubscriptionId: existingSubscription.stripe_subscription_id,
              stripeCustomerId: existingSubscription.stripe_customer_id,
              status: existingSubscription.status,
              currentPeriodStart: existingSubscription.current_period_start,
              currentPeriodEnd: existingSubscription.current_period_end,
              cancelAt: existingSubscription.cancel_at,
              canceledAt: existingSubscription.canceled_at,
              createdAt: existingSubscription.created_at,
              updatedAt: existingSubscription.updated_at,
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      // Get organization info
      const { data: organization, error: orgError } = await supabase
        .from('organizations')
        .select('name, email, admin_email')
        .eq('id', organizationId)
        .single()
      
      if (orgError) {
        console.error('Error fetching organization:', orgError)
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Failed to fetch organization details',
            details: orgError
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
      
      let stripeCustomerId = 'pending'
      
      // Create a Stripe customer in advance
      try {
        const customer = await stripe.customers.create({
          email: organization.admin_email || organization.email,
          name: organization.name,
          metadata: {
            organizationId
          }
        })
        
        stripeCustomerId = customer.id
        console.log('Created Stripe customer:', stripeCustomerId)
      } catch (stripeError) {
        console.warn('Could not create Stripe customer yet, will create during subscription activation:', stripeError)
        // Continue with pending customer ID, will be updated when subscription is activated
      }
      
      // Create inactive subscription
      const { data: subscription, error: insertError } = await supabase
        .from('subscriptions')
        .insert({
          organization_id: organizationId,
          status: 'inactive',
          stripe_subscription_id: 'pending',
          stripe_customer_id: stripeCustomerId
        })
        .select()
        .single()
      
      if (insertError) {
        console.error('Error creating inactive subscription:', insertError)
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Failed to create inactive subscription',
            details: insertError
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
      
      console.log('Created inactive subscription:', subscription.id)
      
      return new Response(
        JSON.stringify({
          success: true,
          subscription: {
            id: subscription.id,
            organizationId: subscription.organization_id,
            stripeSubscriptionId: subscription.stripe_subscription_id,
            stripeCustomerId: subscription.stripe_customer_id,
            status: subscription.status,
            currentPeriodStart: subscription.current_period_start,
            currentPeriodEnd: subscription.current_period_end,
            cancelAt: subscription.cancel_at,
            canceledAt: subscription.canceled_at,
            createdAt: subscription.created_at,
            updatedAt: subscription.updated_at,
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Create a setup intent for future payment method attachment
    if (action === 'create_setup_intent') {
      // Fetch the subscription to get customer ID
      const { data: subscription, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('stripe_customer_id')
        .eq('organization_id', organizationId)
        .single()
      
      if (subscriptionError || !subscription) {
        console.error('Error fetching subscription:', subscriptionError)
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Failed to fetch subscription',
            details: subscriptionError
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
      
      // If customer ID is pending, we need to create a Stripe customer first
      let customerId = subscription.stripe_customer_id
      if (customerId === 'pending') {
        // Get organization info
        const { data: organization, error: orgError } = await supabase
          .from('organizations')
          .select('name, email, admin_email')
          .eq('id', organizationId)
          .single()
        
        if (orgError) {
          console.error('Error fetching organization:', orgError)
          return new Response(
            JSON.stringify({ 
              success: false,
              error: 'Failed to fetch organization details',
              details: orgError
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          )
        }
        
        // Create a Stripe customer
        const customer = await stripe.customers.create({
          email: organization.admin_email || organization.email,
          name: organization.name,
          metadata: {
            organizationId
          }
        })
        
        customerId = customer.id
        
        // Update the subscription with the real customer ID
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({ stripe_customer_id: customerId })
          .eq('organization_id', organizationId)
        
        if (updateError) {
          console.error('Error updating subscription with customer ID:', updateError)
        }
      }
      
      // Create a setup intent
      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card'],
      })
      
      return new Response(
        JSON.stringify({ clientSecret: setupIntent.client_secret }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Handle other subscription actions (create subscription, etc.)
    // Note: We'd implement additional actions like creating an active subscription here
    
    return new Response(
      JSON.stringify({ error: 'Invalid action requested' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
