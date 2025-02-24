
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface ProcessAnalysisRequest {
  fileId: string;
  organizationId: string;
  leadId: string;
  llmProvider: 'openai' | 'perplexity';
}

async function checkLeadlyCredits(organizationId: string): Promise<boolean> {
  const { data: creditBalance, error } = await supabase
    .from('credit_balances')
    .select('total_credits, used_credits')
    .eq('organization_id', organizationId)
    .single();

  if (error || !creditBalance) {
    throw new Error('Erro ao verificar créditos Leadly');
  }

  return (creditBalance.total_credits - creditBalance.used_credits) >= 1;
}

async function checkLLMCredits(organizationId: string, provider: string): Promise<boolean> {
  const { data: organization, error } = await supabase
    .from('organizations')
    .select('integrated_llm')
    .eq('id', organizationId)
    .single();

  if (error || !organization) {
    throw new Error('Organização não encontrada');
  }

  // Verificar saldo do LLM baseado no provider
  if (provider === 'openai') {
    const openaiKey = Deno.env.get(`OPENAI_API_KEY_${organizationId}`);
    if (!openaiKey) throw new Error('Chave da OpenAI não configurada');

    const response = await fetch('https://api.openai.com/v1/credit_grants', {
      headers: { 'Authorization': `Bearer ${openaiKey}` }
    });
    const data = await response.json();
    return data.total_available > 0;
  } else if (provider === 'perplexity') {
    const perplexityKey = Deno.env.get(`PERPLEXITY_API_KEY_${organizationId}`);
    if (!perplexityKey) throw new Error('Chave da Perplexity não configurada');
    
    // Aqui implementaríamos a verificação de créditos da Perplexity
    // Por enquanto retornamos true pois a Perplexity não tem endpoint de verificação de créditos
    return true;
  }

  return false;
}

async function processFile(fileId: string, organizationId: string, leadId: string) {
  try {
    // Atualizar status do arquivo para processing
    await supabase
      .from('organization_lead_files')
      .update({ status: 'processing' })
      .eq('id', fileId);

    // Buscar prompts ativos
    const { data: prompts } = await supabase
      .from('prompts')
      .select('*')
      .eq('is_active', true);

    // Criar análise para cada prompt
    for (const prompt of prompts || []) {
      await supabase
        .from('organization_lead_analyses')
        .insert({
          lead_id: leadId,
          file_id: fileId,
          prompt_id: prompt.id,
          analysis_type: prompt.type,
          status: 'pending',
          processed_data: {},
          raw_result: {}
        });
    }

    // Debitar crédito Leadly
    await supabase.rpc('debit_organization_credits', {
      p_organization_id: organizationId,
      p_credits_to_debit: 1
    });

    // Atualizar status do arquivo para success
    await supabase
      .from('organization_lead_files')
      .update({ 
        status: 'success',
        processed: true
      })
      .eq('id', fileId);

  } catch (error) {
    console.error('Erro no processamento:', error);
    
    // Atualizar status do arquivo para error
    await supabase
      .from('organization_lead_files')
      .update({ 
        status: 'error',
        error_message: error.message
      })
      .eq('id', fileId);

    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileId, organizationId, leadId, llmProvider } = await req.json() as ProcessAnalysisRequest;

    // Verificar créditos Leadly
    const hasLeadlyCredits = await checkLeadlyCredits(organizationId);
    if (!hasLeadlyCredits) {
      return new Response(
        JSON.stringify({ 
          error: 'Créditos Leadly insuficientes',
          code: 'INSUFFICIENT_LEADLY_CREDITS'
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Verificar créditos do LLM
    const hasLLMCredits = await checkLLMCredits(organizationId, llmProvider);
    if (!hasLLMCredits) {
      return new Response(
        JSON.stringify({ 
          error: 'Créditos do provedor LLM insuficientes',
          code: 'INSUFFICIENT_LLM_CREDITS'
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Iniciar processamento em background
    EdgeRuntime.waitUntil(processFile(fileId, organizationId, leadId));

    return new Response(
      JSON.stringify({ 
        message: 'Processamento iniciado com sucesso',
        fileId
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Erro:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        code: 'PROCESSING_ERROR'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
