
import { supabase } from "@/integrations/supabase/client";
import { CreateOrganizationFormData } from "../schema";
import { Organization, OrganizationStatus } from "@/types";
import { createMensalidadeTitle } from "@/services/financial";
import { getPlanValue } from "../utils/calculation-utils";
import { checkExistingOrganization } from "../utils/cnpj-verification-utils";

/**
 * Creates a new organization in the database
 */
export const createOrganization = async (values: CreateOrganizationFormData) => {
  try {
    console.log("Iniciando criação de organização com os dados:", values);
    
    // First, get the plan name to store alongside the ID
    const { data: planData, error: planError } = await supabase
      .from('plans')
      .select('name, price')
      .eq('id', values.plan)
      .single();
    
    if (planError) {
      console.error("Error fetching plan details:", planError);
      throw planError;
    }
    
    // Registrar o plano e seu valor para debug
    console.log("Plano selecionado:", planData?.name, "Valor:", planData?.price);
    
    // Simplificando a inserção para evitar problemas
    const { data, error } = await supabase
      .from('organizations')
      .insert([{
        name: values.razaoSocial,
        nome_fantasia: values.nomeFantasia,
        plan: values.plan,
        status: "pending",
        phone: values.phone,
        cnpj: values.cnpj,
        admin_name: values.adminName,
        admin_email: values.adminEmail,
        admin_phone: values.adminPhone,
        email: values.adminEmail,
        contract_status: 'pending',
        payment_status: 'pending',
        registration_status: 'pending',
        pending_reason: 'user_validation'
      }])
      .select();
    
    if (error) {
      console.error("Error creating organization:", error);
      throw error;
    }
    
    // Garantir que temos um objeto de dados único
    const newOrg = Array.isArray(data) && data.length > 0 ? data[0] : data;
    
    console.log("Organização criada com sucesso:", newOrg);
    
    return { 
      data: newOrg, 
      error: null, 
      planName: planData?.name, 
      planPrice: planData?.price 
    };
  } catch (error) {
    console.error("Error in createOrganization:", error);
    return { 
      data: null, 
      error, 
      planName: null, 
      planPrice: null 
    };
  }
};

/**
 * Transforms database organization format to match Organization type
 */
export const mapToOrganizationType = (dbOrganization: any): Organization => {
  // Calculate overall status based on individual statuses
  const allStepsCompleted = 
    dbOrganization.contract_status === 'completed' && 
    dbOrganization.payment_status === 'completed' && 
    dbOrganization.registration_status === 'completed';
  
  // Determine current pending reason based on first incomplete step
  let currentPendingReason = dbOrganization.pending_reason || null;
  if (!currentPendingReason) {
    if (dbOrganization.registration_status === 'pending') {
      currentPendingReason = 'user_validation';
    } else if (dbOrganization.contract_status === 'pending') {
      currentPendingReason = 'contract_signature';
    } else if (dbOrganization.payment_status === 'pending') {
      currentPendingReason = 'pro_rata_payment';
    }
  }

  // Ensure the status is one of the valid OrganizationStatus values
  const status = (dbOrganization.status || 'pending') as OrganizationStatus;

  // Ensure users have the required permissions field
  const users = Array.isArray(dbOrganization.users) ? dbOrganization.users.map((user: any) => {
    return {
      ...user,
      permissions: user.permissions || {}
    };
  }) : [];

  // Criar objeto de organização formatado com valores padrão para campos opcionais
  const formattedOrg: Organization = {
    id: dbOrganization.id,
    name: dbOrganization.name,
    nomeFantasia: dbOrganization.nome_fantasia || "",
    plan: dbOrganization.plan,
    planName: dbOrganization.plan_name || dbOrganization.planName || "Plano não especificado",
    users: users,
    status: status,
    pendingReason: currentPendingReason,
    contractStatus: dbOrganization.contract_status || 'pending',
    paymentStatus: dbOrganization.payment_status || 'pending',
    registrationStatus: dbOrganization.registration_status || 'pending',
    integratedCRM: dbOrganization.integrated_crm,
    integratedLLM: dbOrganization.integrated_llm,
    email: dbOrganization.email || dbOrganization.admin_email || "",
    phone: dbOrganization.phone || "",
    cnpj: dbOrganization.cnpj,
    adminName: dbOrganization.admin_name,
    adminEmail: dbOrganization.admin_email,
    adminPhone: dbOrganization.admin_phone || "",
    contractSignedAt: dbOrganization.contract_signed_at,
    createdAt: dbOrganization.created_at || new Date().toISOString(),
    logo: dbOrganization.logo,
    address: dbOrganization.address || {
      logradouro: dbOrganization.logradouro || "",
      numero: dbOrganization.numero || "",
      complemento: dbOrganization.complemento || "",
      bairro: dbOrganization.bairro || "",
      cidade: dbOrganization.cidade || "",
      estado: dbOrganization.estado || "",
      cep: dbOrganization.cep || ""
    }
  };
  
  return formattedOrg;
};

/**
 * Creates a monthly title for the newly created organization
 */
export const handleMensalidadeCreation = async (organization: Organization) => {
  try {
    // Buscar o valor do plano diretamente do banco de dados
    const planType = organization.plan;
    if (!planType) {
      console.error("Plano não definido para a organização:", organization.id);
      return null;
    }
    
    const planValue = await getPlanValue(planType);
    
    console.log(`Criando título de mensalidade para organização ${organization.id} com valor ${planValue}`);
    
    if (!planValue || planValue <= 0) {
      console.error("Valor do plano inválido:", planValue);
      return null;
    }
    
    return await createMensalidadeTitle(organization, planValue);
  } catch (error) {
    console.error('Erro ao criar título de mensalidade:', error);
    return null;
  }
};

/**
 * Sends onboarding email with all necessary links
 */
export const sendOnboardingEmail = async (
  organizationId: string,
  confirmationToken: string,
  planName: string,
  mensalidadeAmount: number
) => {
  // URL para a confirmação do cadastro
  const confirmationUrl = `${window.location.origin}/confirm-registration/${organizationId}`;

  const { error } = await supabase.functions.invoke('send-organization-emails', {
    body: {
      organizationId,
      type: 'onboarding',
      data: {
        confirmationToken: confirmationUrl,
        planName,
        mensalidadeAmount
      }
    }
  });
  
  return { error };
};

// Re-export the checkExistingOrganization function for backwards compatibility
export { checkExistingOrganization };
