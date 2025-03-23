
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
    // Parse request body
    const requestData = await req.json();
    const { organizationId, generateAll = false, useCurrentDay = false } = requestData;
    
    // Usar dia atual ou primeiro dia do mês como vencimento
    const today = new Date();
    let dueDate;
    
    if (useCurrentDay) {
      // Usar dia atual
      dueDate = today;
    } else {
      // Usar primeiro dia do mês
      dueDate = new Date(today.getFullYear(), today.getMonth(), 1);
    }
    
    // Referência para o mês (formato YYYY-MM)
    const referenceMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    
    // Se temos um ID de organização, geramos título apenas para ela
    if (organizationId && !generateAll) {
      return await generateTitleForOrganization(organizationId, dueDate, referenceMonth);
    }
    
    // Caso contrário, geramos para todas as organizações com assinaturas ativas
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
    
    const createdTitles = [];
    
    for (const subscription of activeSubscriptions) {
      try {
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
          
          // Aqui deveria processar o pagamento através do cartão cadastrado, mas isso seria feito 
          // em um fluxo separado ou usando a API do Stripe diretamente
        }
      } catch (err) {
        console.error(`Erro ao processar organização ${subscription.organization_id}:`, err);
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

// Função para gerar um título para uma organização específica
async function generateTitleForOrganization(organizationId: string, dueDate: Date, referenceMonth: string) {
  try {
    // Verificar se já existe um título para este mês/organização
    const { data: existingTitles, error: checkError } = await supabase
      .from('financial_titles')
      .select('id')
      .eq('organization_id', organizationId)
      .eq('type', 'mensalidade')
      .eq('reference_month', referenceMonth)
      .limit(1);
      
    if (checkError) {
      throw checkError;
    }
    
    // Se já existe um título para este mês, retornar erro
    if (existingTitles && existingTitles.length > 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Título de mensalidade já existe para esta organização no mês ${referenceMonth}` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Obter o plano/valor da organização
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('plan, name')
      .eq('id', organizationId)
      .single();
      
    if (orgError) {
      throw orgError;
    }
    
    // Obter o valor do plano
    const { data: planData, error: planError } = await supabase
      .from('plans')
      .select('price')
      .eq('name', organization.plan)
      .single();
      
    if (planError) {
      throw planError;
    }
    
    // Criar título financeiro para a mensalidade
    const { data: newTitle, error: createError } = await supabase
      .from('financial_titles')
      .insert({
        organization_id: organizationId,
        type: 'mensalidade',
        value: planData.price,
        due_date: dueDate.toISOString(),
        status: 'pending',
        reference_month: referenceMonth
      })
      .select()
      .single();
      
    if (createError) {
      throw createError;
    }
    
    console.log(`Título criado com sucesso para organização ${organizationId}: ${newTitle.id}`);
    
    // Aqui deveria processar o pagamento através do cartão cadastrado, mas isso seria feito 
    // em um fluxo separado ou usando a API do Stripe diretamente
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Título mensal criado com sucesso para ${organization.name}`,
        title: newTitle.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error(`Erro ao criar título para organização ${organizationId}:`, error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}
