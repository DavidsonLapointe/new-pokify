
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

    console.log(`Processing ${action} request for organization: ${organizationId}`)

    // Setup Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Setup Stripe client
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') ?? ''
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY not configured');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Stripe configuration missing' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const stripe = new Stripe(stripeSecretKey, {
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
        console.log('Creating Stripe customer for organization:', organizationId)
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
      console.log('Creating setup intent for organization:', organizationId)
      
      // Fetch the subscription to get customer ID
      const { data: subscription, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('stripe_customer_id')
        .eq('organization_id', organizationId)
        .single()
      
      if (subscriptionError || !subscription) {
        console.error('Error fetching subscription:', subscriptionError || 'No subscription found')
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Failed to fetch subscription',
            details: subscriptionError || 'No subscription found'
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
        try {
          console.log('Creating new Stripe customer for organization:', organizationId)
          const customer = await stripe.customers.create({
            email: organization.admin_email || organization.email,
            name: organization.name,
            metadata: {
              organizationId
            }
          })
          
          customerId = customer.id
          console.log('Created new Stripe customer:', customerId)
          
          // Update the subscription with the real customer ID
          const { error: updateError } = await supabase
            .from('subscriptions')
            .update({ stripe_customer_id: customerId })
            .eq('organization_id', organizationId)
          
          if (updateError) {
            console.error('Error updating subscription with customer ID:', updateError)
          }
        } catch (stripeError) {
          console.error('Error creating Stripe customer:', stripeError)
          return new Response(
            JSON.stringify({ 
              success: false,
              error: 'Failed to create Stripe customer',
              details: stripeError
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          )
        }
      }
      
      // Create a setup intent
      try {
        console.log('Creating Stripe setup intent for customer:', customerId)
        const setupIntent = await stripe.setupIntents.create({
          customer: customerId,
          payment_method_types: ['card'],
        })
        
        console.log('Setup intent created with client secret:', setupIntent.client_secret ? 'Available' : 'Not available')
        
        return new Response(
          JSON.stringify({ 
            success: true,
            clientSecret: setupIntent.client_secret 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (stripeError) {
        console.error('Error creating setup intent:', stripeError)
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Failed to create setup intent',
            details: stripeError
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
    }
    
    // Create active subscription with payment method and price
    if (action === 'create_subscription') {
      console.log('Creating active subscription for organization:', organizationId)
      
      // Validate required parameters
      if (!paymentMethodId || !priceId) {
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Missing required parameters: paymentMethodId and priceId are required' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
      
      // Find the inactive subscription
      const { data: inactiveSubscription, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('status', 'inactive')
        .single()
      
      if (fetchError || !inactiveSubscription) {
        console.error('Error fetching inactive subscription:', fetchError || 'Subscription not found')
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'No inactive subscription found for this organization',
            details: fetchError
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        )
      }
      
      const customerId = inactiveSubscription.stripe_customer_id
      if (customerId === 'pending') {
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Customer ID is not valid. Please create a setup intent first.' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
      
      try {
        // Attach payment method to customer if not already attached
        console.log('Attaching payment method to customer:', customerId)
        await stripe.paymentMethods.attach(
          paymentMethodId,
          { customer: customerId }
        )
        
        // Set as default payment method
        console.log('Setting default payment method for customer:', customerId)
        await stripe.customers.update(
          customerId,
          { 
            invoice_settings: {
              default_payment_method: paymentMethodId,
            }
          }
        )
        
        // Create the subscription
        console.log('Creating Stripe subscription for customer:', customerId, 'with price:', priceId)
        const subscription = await stripe.subscriptions.create({
          customer: customerId,
          items: [{ price: priceId }],
          default_payment_method: paymentMethodId,
          expand: ['latest_invoice.payment_intent'],
        })
        
        console.log('Subscription created:', subscription.id, 'with status:', subscription.status)
        
        // Update the subscription in Supabase
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('id', inactiveSubscription.id)
        
        if (updateError) {
          console.error('Error updating subscription in database:', updateError)
          return new Response(
            JSON.stringify({ 
              success: false,
              error: 'Failed to update subscription in database',
              details: updateError
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          )
        }
        
        return new Response(
          JSON.stringify({
            success: true,
            subscriptionId: subscription.id,
            clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
            status: subscription.status
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (stripeError) {
        console.error('Stripe error:', stripeError)
        return new Response(
          JSON.stringify({ 
            success: false,
            error: stripeError.message 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
    }
    
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
