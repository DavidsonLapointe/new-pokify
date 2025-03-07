
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

// CORS headers for the Stripe webhook
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Create Supabase client
export const createSupabaseClient = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  return createClient(supabaseUrl, supabaseServiceKey)
}

// Invoke financial-title-handler Edge Function
export async function invokeFinancialTitleHandler(action: string, payload: any, subscription?: any) {
  const supabase = createSupabaseClient();
  
  try {
    const { data, error } = await supabase.functions.invoke('financial-title-handler', {
      body: {
        action,
        payload,
        subscription
      }
    });
    
    if (error) {
      console.error(`Error invoking financial-title-handler for ${action}:`, error);
      return false;
    }
    
    return data.success;
  } catch (error) {
    console.error(`Exception invoking financial-title-handler for ${action}:`, error);
    return false;
  }
}
