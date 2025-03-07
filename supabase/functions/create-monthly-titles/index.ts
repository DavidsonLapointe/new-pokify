
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log('Iniciando criação de títulos mensais para assinaturas ativas');
    
    // Obter todas as assinaturas ativas
    const { data: activeSubscriptions, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('id, organization_id, stripe_subscription_id')
      .eq('status', 'active');
      
    if (subscriptionError) {
      throw subscriptionError;
    }
    
    console.log(`Encontradas ${activeSubscriptions?.length || 0} assinaturas ativas`);
    
    if (!activeSubscriptions || activeSubscriptions.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'Nenhuma assinatura ativa encontrada' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Data para vencimento (primeiro dia do mês atual)
    const today = new Date();
    const dueDate = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Referência para o mês (formato YYYY-MM)
    const referenceMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    
    const createdTitles = [];
    
    for (const subscription of activeSubscriptions) {
      // Verificar se já existe um título para este mês/organização
      const { data: existingTitles, error: checkError } = await supabase
        .from('financial_titles')
        .select('id')
        .eq('organization_id', subscription.organization_id)
        .eq('type', 'mensalidade')
        .eq('reference_month', referenceMonth)
        .limit(1);
        
      if (checkError) {
        console.error(`Erro ao verificar títulos existentes para organização ${subscription.organization_id}:`, checkError);
        continue;
      }
      
      // Se já existe um título para este mês, pular
      if (existingTitles && existingTitles.length > 0) {
        console.log(`Título de mensalidade já existe para organização ${subscription.organization_id} no mês ${referenceMonth}`);
        continue;
      }
      
      // Obter o plano/valor da organização
      const { data: organization, error: orgError } = await supabase
        .from('organizations')
        .select('plan, name')
        .eq('id', subscription.organization_id)
        .single();
        
      if (orgError) {
        console.error(`Erro ao buscar dados da organização ${subscription.organization_id}:`, orgError);
        continue;
      }
      
      // Obter o valor do plano
      const { data: planData, error: planError } = await supabase
        .from('plans')
        .select('price')
        .eq('name', organization.plan)
        .single();
        
      if (planError) {
        console.error(`Erro ao buscar valor do plano ${organization.plan}:`, planError);
        continue;
      }
      
      // Criar título financeiro para a mensalidade
      const { data: newTitle, error: createError } = await supabase
        .from('financial_titles')
        .insert({
          organization_id: subscription.organization_id,
          type: 'mensalidade',
          value: planData.price,
          due_date: dueDate.toISOString(),
          status: 'pending',
          reference_month: referenceMonth
        })
        .select()
        .single();
        
      if (createError) {
        console.error(`Erro ao criar título para organização ${subscription.organization_id}:`, createError);
      } else {
        console.log(`Título criado com sucesso para organização ${subscription.organization_id}: ${newTitle.id}`);
        createdTitles.push(newTitle.id);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Criados ${createdTitles.length} títulos de mensalidade`, 
        titles: createdTitles 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Erro ao criar títulos mensais:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
