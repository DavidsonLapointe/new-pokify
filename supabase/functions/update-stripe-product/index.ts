
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Stripe } from 'https://esm.sh/stripe@13.10.0'

// Initialize Stripe with API key
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Main handler function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return createCorsResponse('ok');
  }

  try {
    console.log('Recebendo requisição para atualizar produto no Stripe');
    const requestData = await req.json();
    
    console.log('Dados recebidos:', requestData);
    
    const result = await processStripeProductUpdate(requestData);
    
    console.log('Resposta final:', result);
    
    return createJsonResponse(result, 200);
  } catch (error) {
    console.error('Erro:', error);
    return createJsonResponse({ 
      success: false,
      error: error.message 
    }, 400);
  }
});

// Helper function to create a response with CORS headers
function createCorsResponse(body, status = 200) {
  return new Response(body, { headers: corsHeaders, status });
}

// Helper function to create a JSON response with CORS headers
function createJsonResponse(data, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status,
    }
  );
}

// Process the Stripe product update request
async function processStripeProductUpdate(requestData) {
  const { 
    stripeProductId, 
    stripePriceId,
    name, 
    description, 
    price,
    active,
    credits,
    returnIds = true
  } = requestData;

  let updatedProduct;
  let updatedPrice;
  let priceUpdated = false;

  // If no product ID, create a new product
  if (!stripeProductId) {
    const result = await createNewStripeProduct(name, description, active, credits, price);
    updatedProduct = result.product;
    updatedPrice = result.price;
  } else {
    // Update existing product
    const result = await updateExistingStripeProduct(
      stripeProductId, 
      stripePriceId, 
      name, 
      description, 
      price, 
      active,
      credits
    );
    updatedProduct = result.product;
    updatedPrice = result.price;
    priceUpdated = result.priceUpdated;
  }

  // Prepare response according to the returnIds option
  let responseData = { success: true };
  
  if (returnIds && updatedProduct) {
    responseData = {
      ...responseData,
      product: updatedProduct,
      price: updatedPrice,
      priceUpdated
    };
  }

  return responseData;
}

// Create a new product in Stripe
async function createNewStripeProduct(name, description, active, credits, price) {
  console.log('Criando novo produto no Stripe');
  
  try {
    // Create the product in Stripe
    const product = await stripe.products.create({
      name,
      description,
      active: active !== undefined ? active : true,
      metadata: {
        credits: credits?.toString(),
        type: credits ? 'additional_credits' : 'subscription'
      }
    });
    
    console.log('Produto criado com sucesso:', product.id);
    
    // Create price for the product
    const priceInCents = Math.round(price * 100); // Convert to cents
    console.log('Criando preço em centavos:', priceInCents);
    
    const priceObj = await stripe.prices.create({
      product: product.id,
      unit_amount: priceInCents,
      currency: 'brl',
      active: active !== undefined ? active : true,
      metadata: {
        credits: credits?.toString()
      }
    });
    
    console.log('Preço criado com sucesso:', priceObj.id);
    
    return { product, price: priceObj };
  } catch (error) {
    console.error('Erro ao criar produto/preço no Stripe:', error);
    throw new Error(`Erro ao criar produto/preço no Stripe: ${error.message}`);
  }
}

// Update an existing product in Stripe
async function updateExistingStripeProduct(stripeProductId, stripePriceId, name, description, price, active, credits) {
  console.log('Atualizando produto existente:', stripeProductId);

  try {
    // Update the product
    const product = await stripe.products.update(stripeProductId, {
      name,
      description,
      active,
      metadata: {
        credits: credits?.toString(),
        type: credits ? 'additional_credits' : 'subscription'
      }
    });
    
    console.log('Produto atualizado com sucesso');

    let updatedPrice = null;
    let priceUpdated = false;

    // Create new price if there's a change in price value or if no price exists
    if (price) {
      const priceResult = await handlePriceUpdate(stripeProductId, stripePriceId, price, active, credits);
      updatedPrice = priceResult.price;
      priceUpdated = priceResult.priceUpdated;
    } else if (stripePriceId) {
      // If no new price provided, use the existing price
      console.log('Mantendo preço atual:', stripePriceId);
      
      const priceData = await stripe.prices.retrieve(stripePriceId);
      updatedPrice = priceData;
    }

    return { product, price: updatedPrice, priceUpdated };
  } catch (error) {
    console.error('Erro ao atualizar produto/preço no Stripe:', error);
    throw new Error(`Erro ao atualizar produto/preço no Stripe: ${error.message}`);
  }
}

// Handle price updates for a product
async function handlePriceUpdate(stripeProductId, stripePriceId, price, active, credits) {
  // Verify current price
  let currentPrice = null;
  let currentPriceInCents = 0;
  
  if (stripePriceId) {
    try {
      currentPrice = await stripe.prices.retrieve(stripePriceId);
      currentPriceInCents = currentPrice.unit_amount || 0;
      console.log('Preço atual recuperado:', currentPrice);
      console.log('Valor atual em centavos:', currentPriceInCents);
    } catch (e) {
      console.log('Não foi possível recuperar o preço atual:', e);
    }
  }

  // Check if the price has changed
  const newPriceInCents = Math.round(price * 100);
  console.log('Novo preço em centavos:', newPriceInCents);
  
  // Check if there's already an active price with the same value for this product
  const existingActivePrice = await findExistingActivePrice(stripeProductId, newPriceInCents);
  
  // Create new price only if there isn't an active price with the same value
  // or if the price has changed from the original price
  const shouldCreateNewPrice = !existingActivePrice && 
                        (!currentPrice || 
                          currentPriceInCents !== newPriceInCents || 
                          !currentPrice.active);

  if (shouldCreateNewPrice) {
    return await createNewPrice(stripeProductId, stripePriceId, newPriceInCents, active, credits);
  } else if (existingActivePrice) {
    return await useExistingPrice(stripePriceId, existingActivePrice);
  } else {
    console.log('Preço não mudou, mantendo o preço atual');
    return { price: currentPrice, priceUpdated: false };
  }
}

// Find existing active price with the same value
async function findExistingActivePrice(stripeProductId, priceInCents) {
  try {
    // Search for all active prices for this product
    const existingPrices = await stripe.prices.list({
      product: stripeProductId,
      active: true
    });
    
    // Check if there's an active price with the same value
    const existingActivePrice = existingPrices.data.find(p => 
      p.unit_amount === priceInCents && p.currency === 'brl'
    );
    
    if (existingActivePrice) {
      console.log('Encontrado preço ativo existente com o mesmo valor:', existingActivePrice.id);
    }
    
    return existingActivePrice;
  } catch (e) {
    console.log('Erro ao buscar preços existentes:', e);
    return null;
  }
}

// Create a new price and deactivate the old one
async function createNewPrice(stripeProductId, stripePriceId, newPriceInCents, active, credits) {
  console.log('Criando novo preço para o produto. Preço em centavos:', newPriceInCents);
  
  const updatedPrice = await stripe.prices.create({
    product: stripeProductId,
    unit_amount: newPriceInCents,
    currency: 'brl',
    active: active !== undefined ? active : true,
    metadata: {
      credits: credits?.toString()
    }
  });
  
  console.log('Novo preço criado com sucesso:', updatedPrice.id);

  // Deactivate the previous price
  if (stripePriceId && stripePriceId !== updatedPrice.id) {
    console.log('Desativando preço anterior:', stripePriceId);
    
    await stripe.prices.update(stripePriceId, {
      active: false
    });
    
    console.log('Preço anterior desativado com sucesso');
  }

  return { price: updatedPrice, priceUpdated: true };
}

// Use existing active price and deactivate redundant price
async function useExistingPrice(stripePriceId, existingActivePrice) {
  console.log('Usando preço ativo existente com o mesmo valor');
  
  // If the current price is different from the existing price with the same value,
  // deactivate the current price
  if (stripePriceId && stripePriceId !== existingActivePrice.id) {
    console.log('Desativando preço anterior redundante:', stripePriceId);
    
    await stripe.prices.update(stripePriceId, {
      active: false
    });
    
    console.log('Preço anterior redundante desativado com sucesso');
    return { price: existingActivePrice, priceUpdated: true };
  }
  
  return { price: existingActivePrice, priceUpdated: false };
}
