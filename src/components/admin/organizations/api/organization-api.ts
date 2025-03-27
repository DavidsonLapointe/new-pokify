import { supabase } from "@/integrations/supabase/realClient";
import { type CreateOrganizationFormData } from "../schema";
import { Organization, OrganizationPlan, OrganizationStatus } from "@/types/organization-types";
import { addDays, endOfMonth, format, startOfMonth, differenceInDays } from "date-fns";

/**
 * Creates a new organization in the database
 */
export const createOrganization = async (values: CreateOrganizationFormData) => {
  try {
    console.log("%c 🏢 CRIAÇÃO DE ORGANIZAÇÃO - INÍCIO", "background: #3498db; color: white; padding: 5px; font-weight: bold; border-radius: 5px;");
    console.log("%c Dados do formulário:", "font-weight: bold;", JSON.stringify(values, null, 2));
    
    // Clean CNPJ before inserting (remove non-numeric characters)
    const cleanedCnpj = values.cnpj.replace(/[^0-9]/g, '');
    
    // Validação de dados críticos
    if (!values.razaoSocial || !values.nomeFantasia || !cleanedCnpj || !values.email || !values.plan) {
      console.error("%c ❌ Dados obrigatórios da organização ausentes", "color: red;", {
        razaoSocial: values.razaoSocial,
        nomeFantasia: values.nomeFantasia,
        cnpj: cleanedCnpj,
        email: values.email,
        plan: values.plan
      });
      return { 
        data: null, 
        error: { message: "Dados obrigatórios da organização ausentes" },
        planName: null 
      };
    }
    
    // Validação de dados do administrador
    if (!values.adminName || !values.adminEmail) {
      console.error("%c ❌ Dados obrigatórios do administrador ausentes", "color: red;", {
        adminName: values.adminName,
        adminEmail: values.adminEmail
      });
      return { 
        data: null,
        error: { message: "Dados obrigatórios do administrador ausentes" },
        planName: null
      };
    }
    
    // Fetch plan name for the selected plan ID
    console.log("%c 🔍 ETAPA 1: Buscando detalhes do plano", "color: #f39c12;", values.plan);
    const { data: planData, error: planError } = await supabase
      .from('planos')
      .select('id, name, value')
      .eq('id', values.plan)
      .single();
      
    console.log("%c Resultado da busca de plano:", "font-weight: bold;", { 
      dados: planData, 
      erro: planError 
    });
      
    if (planError) {
      console.error("%c ❌ Erro ao buscar detalhes do plano:", "color: red;", planError);
      return { data: null, error: planError, planName: null };
    }
    
    // Convert modules array to PostgreSQL array format
    let modulosIds = null;
    if (values.modules && values.modules.length > 0) {
      // Formato de array do PostgreSQL: {elemento1,elemento2}
      modulosIds = `{${values.modules.join(',')}}`;
    }
    
    const organizationData = {
      razao_social: values.razaoSocial,
      nome_fantasia: values.nomeFantasia,
      cnpj: cleanedCnpj,
      email_empresa: values.email,
      telefone_empresa: values.phone,
      plano_id: values.plan,
      user_admin_id: values.adminEmail,
      modulos_ids: modulosIds
    };
    
    console.log("%c 📋 ETAPA 2: Dados para inserção na tabela 'organization'", "color: #f39c12;", organizationData);
    
    // Verificar se já existe organização com este CNPJ
    console.log("%c 🔍 ETAPA 3: Verificando CNPJ existente", "color: #f39c12;", cleanedCnpj);
    const { data: existingOrg, error: checkError } = await supabase
      .from('organization')
      .select('id, razao_social')
      .eq('cnpj', cleanedCnpj)
      .limit(1);
      
    console.log("%c Resultado da verificação de CNPJ:", "font-weight: bold;", {
      dados: existingOrg,
      erro: checkError
    });
      
    if (checkError) {
      console.error("%c ❌ Erro ao verificar CNPJ existente:", "color: red;", checkError);
    } else if (existingOrg && existingOrg.length > 0) {
      console.error("%c ❌ CNPJ já existe", "color: red;", `CNPJ ${cleanedCnpj} já existe para a organização "${existingOrg[0].razao_social}"`);
      return { 
        data: null, 
        error: { message: `CNPJ ${values.cnpj} já está em uso por outra empresa` },
        planName: null
      };
    } else {
      console.log("%c ✅ CNPJ não encontrado, prosseguindo com a criação", "color: green;");
    }
    
    // Insert the new organization
    console.log("%c 📝 ETAPA 4: Inserindo nova organização", "color: #f39c12;", "Payload:", organizationData);
    const organizationInsertResult = await supabase
      .from('organization')
      .insert(organizationData)
      .select('*')
      .single();
    
    const { data, error } = organizationInsertResult;
    
    console.log("%c Resultado da inserção da organização:", "font-weight: bold;", {
      dados: data,
      erro: error,
      resposta_completa: organizationInsertResult
    });
    
    if (error) {
      console.error("%c ❌ Erro ao criar organização:", "color: red;", error);
      if (error.code === '23505') {
        return { 
          data: null, 
          error: { message: "CNPJ já cadastrado no sistema" },
          planName: null
        };
      }
      return { data: null, error, planName: null };
    }
    
    if (!data || !data.id) {
      console.error("%c ❌ Organização criada, mas sem ID retornado", "color: red;");
      return { 
        data: null, 
        error: { message: "Erro ao criar organização: ID não retornado" },
        planName: null
      };
    }
    
    console.log("%c ✅ ETAPA 4 CONCLUÍDA: Organização criada com sucesso!", "color: green;", {
      id: data.id,
      nome: data.nome_fantasia
    });
    
    // Now create the admin profile in the profiles table
    console.log("%c 👤 ETAPA 5: Criando perfil de administrador", "color: #f39c12;", `ID da organização: ${data.id}`);
    
    try {
      const profileInsertData = {
        name: values.adminName,
        email: values.adminEmail,
        tel: values.phone,
        function: 'organization_admin', // user_type enum value for admin
        status: 'active', // user_status enum value for active
        user_id: values.adminEmail, // Using email as user_id temporarily
        organization_id: data.id // Link to the newly created organization
      };
      
      console.log("%c Dados do perfil a serem inseridos:", "font-weight: bold;", profileInsertData);
      
      const profileInsertResult = await supabase
        .from('profiles')
        .insert(profileInsertData)
        .select('*')
        .single();

      const { data: profileData, error: profileError } = profileInsertResult;
      
      console.log("%c Resultado da inserção do perfil:", "font-weight: bold;", {
        dados: profileData,
        erro: profileError,
        resposta_completa: profileInsertResult
      });

      if (profileError) {
        console.error("%c ❌ Erro ao criar perfil de administrador:", "color: red;", profileError);
        console.warn("%c ⚠️ Organização criada, mas houve falha ao criar o perfil", "color: orange;");
        
        // Tentar determinar o erro específico
        if (profileError.code === '23505') {
          console.error("%c ❌ Erro de duplicidade no perfil.", "color: red;", "Possível perfil já existente com este email.");
        } else if (profileError.code === '23503') {
          console.error("%c ❌ Erro de chave estrangeira.", "color: red;", "Possível problema com organization_id.");
        }
      } else {
        console.log("%c ✅ ETAPA 5 CONCLUÍDA: Perfil de administrador criado!", "color: green;", profileData);
      }
      
      console.log("%c 🏁 CRIAÇÃO DE ORGANIZAÇÃO - CONCLUÍDO", "background: #2ecc71; color: white; padding: 5px; font-weight: bold; border-radius: 5px;");
      
      return { 
        data, 
        error: null, 
        planName: planData?.name || null,
        planPrice: planData?.value || 0,
        profile: profileError ? null : profileData
      };
    } catch (profileCreateError) {
      console.error("%c ❌ Erro inesperado ao criar perfil:", "color: red;", profileCreateError);
      
      return { 
        data, 
        error: null, 
        planName: planData?.name || null,
        planPrice: planData?.value || 0,
        profile: null,
        profileError: profileCreateError
      };
    }
  } catch (error) {
    console.error("%c ❌ ERRO CRÍTICO ao criar organização:", "background: #c0392b; color: white; padding: 5px; font-weight: bold; border-radius: 5px;", error);
    return { 
      data: null, 
      error: {
        message: "Erro inesperado ao criar organização",
        details: JSON.stringify(error)
      }, 
      planName: null,
      planPrice: 0
    };
  }
};

/**
 * Calculates the pro-rata value based on the organization's plan and the current date
 */
const calculateProRataValue = (planPrice: number): number => {
  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  const totalDays = differenceInDays(end, start) + 1;
  const remainingDays = differenceInDays(end, today) + 1;
  const dailyRate = planPrice / totalDays;
  const proRata = dailyRate * remainingDays;

  return proRata;
};

// Instead of using createProRataTitle from organizationTitleService, let's implement it directly
/**
 * Creates a pro-rata financial title for a new organization
 */
const createProRataTitle = async (params: {
  organizationId: string;
  dueDate: string;
  value: number;
}) => {
  try {
    const { data, error } = await supabase
      .from('financial_titles')
      .insert({
        organization_id: params.organizationId,
        type: 'pro_rata',
        value: params.value,
        due_date: params.dueDate,
        status: 'pending',
        reference_month: format(new Date(), 'yyyy-MM')
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar título pro-rata:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Erro inesperado ao criar título pro-rata:", error);
    return null;
  }
};

/**
 * Handles the creation of a pro-rata financial title for a new organization
 */
export const handleProRataCreation = async (organization: Organization) => {
  try {
    console.log(`Iniciando criação de título pro-rata para a organização: ${organization.id}`);

    // Get the current date
    const currentDate = new Date();

    // Format the due date to the last day of the current month
    const dueDate = format(endOfMonth(currentDate), 'yyyy-MM-dd');

    // Get the plan data
    let planPrice = 0;
    
    if (typeof organization.plan === 'string') {
      // Fetch plan info from the database
      const { data: planData } = await supabase
        .from('planos')
        .select('value')
        .eq('id', organization.plan)
        .single();
        
      planPrice = planData?.value || 0;
    } else {
      // Plan is already an object with price
      planPrice = organization.plan.value;
    }

    // Calculate the pro-rata value
    const proRataValue = calculateProRataValue(planPrice);

    // Create the pro-rata title
    const proRataTitle = await createProRataTitle({
      organizationId: organization.id,
      dueDate: dueDate,
      value: proRataValue,
    });

    console.log("Título pro-rata criado:", proRataTitle);
    return proRataTitle;
  } catch (error) {
    console.error("Erro ao criar título pro-rata:", error);
    return null;
  }
};

/**
 * Sends an onboarding email to the organization's admin
 */
export const sendOnboardingEmail = async (
  organizationId: string,
  contractLink: string,
  confirmRegistrationLink: string,
  paymentLink: string,
  proRataValue: number,
  selectedModules: string[] = []
) => {
  try {
    console.log("%c 📧 ENVIANDO EMAIL DE ONBOARDING", "background: #2980b9; color: white; padding: 5px; font-weight: bold; border-radius: 5px;");
    console.log("%c Dados para envio de email:", "font-weight: bold;", {
      organizationId,
      contractLink,
      confirmRegistrationLink,
      paymentLink,
      proRataValue,
      selectedModules
    });
    
    // Get module names if modules were selected
    let moduleNames: string[] = [];
    
    if (selectedModules && selectedModules.length > 0) {
      // Handle module lookup differently since "modules" is not a direct table
      // Instead, we'll use hardcoded module names or fetch from a different source
      // For now, we'll just pass the raw module IDs as names
      moduleNames = selectedModules;
      
      console.log("%c Módulos selecionados para o email:", "color: #3498db;", moduleNames.join(', '));
    }

    console.log("%c Chamando função Supabase 'send-organization-emails'", "color: #3498db;");
    
    const emailPayload = {
      organizationId: organizationId,
      type: "onboarding",
      data: {
        contractUrl: contractLink,
        confirmationToken: confirmRegistrationLink,
        paymentUrl: paymentLink,
        proRataAmount: proRataValue,
        selectedModules: moduleNames  // Pass module names to the email function
      }
    };
    console.log("%c Payload da requisição:", "font-weight: bold;", emailPayload);
    
    const emailResult = await supabase.functions.invoke('send-organization-emails', {
      body: emailPayload,
    });

    const { error } = emailResult;
    
    console.log("%c Resultado do envio de email:", "font-weight: bold;", emailResult);

    if (error) {
      console.error("%c ❌ Erro ao enviar email de onboarding:", "color: red;", error);
      return { error };
    }

    console.log("%c ✅ Email de onboarding enviado com sucesso", "color: green;");
    return { error: null };
  } catch (error) {
    console.error("%c ❌ Erro ao chamar a função de email de onboarding:", "color: red;", error);
    return { error: error };
  }
};

/**
 * Maps the database organization type to the application's Organization type
 */
export const mapToOrganizationType = (dbOrg: any): Organization => {
  let planValue: string | OrganizationPlan;
  
  // Convert plan to either string or OrganizationPlan
  if (typeof dbOrg.plano_id === 'string') {
    planValue = dbOrg.plano_id;
  } else if (dbOrg.plano_id && typeof dbOrg.plano_id === 'object') {
    planValue = {
      id: dbOrg.plano_id.id,
      name: dbOrg.plano_id.name,
      value: dbOrg.plano_id.value || 0
    };
  } else {
    planValue = dbOrg.plano_id || '';
  }

  // Convert modules from string to array if it exists
  let modulesValue: string[] | undefined;
  if (dbOrg.modulos_ids) {
    modulesValue = typeof dbOrg.modulos_ids === 'string' ? 
      dbOrg.modulos_ids.split(',') : 
      dbOrg.modulos_ids;
  }

  // Map database status to OrganizationStatus, ensuring it's valid
  let status: OrganizationStatus = dbOrg.status as OrganizationStatus;
  if (!["active", "pending", "suspended", "canceled", "inactive"].includes(status)) {
    status = "pending"; // Default to pending if invalid status
  }

  return {
    id: dbOrg.id,
    name: dbOrg.razao_social,
    nomeFantasia: dbOrg.nome_fantasia,
    plan: planValue,
    planName: dbOrg.plano_id?.name,
    users: [], // You might need to fetch the users separately
    status: status,
    pendingReason: dbOrg.pending_reason || null,
    contractStatus: dbOrg.contract_status,
    paymentStatus: dbOrg.payment_status,
    registrationStatus: dbOrg.registration_status,
    integratedCRM: dbOrg.integrated_crm,
    integratedLLM: dbOrg.integrated_llm,
    email: dbOrg.email_empresa,
    phone: dbOrg.telefone_empresa,
    cnpj: dbOrg.cnpj,
    adminName: dbOrg.user_admin_id,
    adminEmail: dbOrg.user_admin_id,
    contractSignedAt: dbOrg.contract_signed_at,
    createdAt: dbOrg.created_at,
    logo: dbOrg.logo,
    modules: modulesValue, // Add modules to the returned organization
    address: dbOrg.logradouro ? {
      logradouro: dbOrg.logradouro,
      numero: dbOrg.numero,
      complemento: dbOrg.complemento,
      bairro: dbOrg.bairro,
      cidade: dbOrg.cidade,
      estado: dbOrg.estado,
      cep: dbOrg.cep,
    } : undefined,
  };
};

/**
 * Checks if an organization with the given CNPJ already exists
 */
export const checkOrganizationExists = async (cnpj: string) => {
  const cleanedCnpj = cnpj.replace(/[^0-9]/g, '');
  
  const { data, error } = await supabase
    .from('organization')
    .select('id, razao_social')
    .eq('cnpj', cleanedCnpj)
    .limit(1);
    
  if (error) {
    console.error("Erro ao verificar existência de organização:", error);
    return { exists: false, error };
  }
  
  return { 
    exists: data && data.length > 0, 
    organization: data?.[0] || null,
    error: null 
  };
};
