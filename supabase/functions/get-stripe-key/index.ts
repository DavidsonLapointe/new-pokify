
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// CORS headers para requisições cross-origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Função principal para servir requisições
serve(async (req) => {
  // Lidar com preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { type } = await req.json();
    
    if (type === 'public') {
      // Retorna a chave pública configurada como variável de ambiente do Supabase
      const publicKey = Deno.env.get('STRIPE_PUBLIC_KEY') || '';
      
      console.log(`Retornando chave pública do Stripe: ${publicKey.substring(0, 8)}...`);
      
      return new Response(
        JSON.stringify({ key: publicKey }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          },
          status: 200 
        }
      );
    } else {
      throw new Error('Tipo de chave não suportado');
    }
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 400 
      }
    );
  }
});
