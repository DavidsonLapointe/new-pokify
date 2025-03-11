
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
  // First, get the plan name to store alongside the ID
  const { data: planData, error: planError } = await supabase
    .from('plans')
    .select('name, price')
    .eq('id', values.plan)
    .single();
  
  if (planError) {
    console.error("Error fetching plan details:", planError);
  }
  
  const { data, error } = await supabase
    .from('organizations')
    .insert({
      name: values.razaoSocial,
      nome_fantasia: values.nomeFantasia,
      plan: planData?.name || 'professional', // Ensure we store plan name instead of ID
      status: "pending",
      phone: values.phone,
      cnpj: values.cnpj,
      admin_name: values.adminName,
      admin_email: values.adminEmail,
      admin_phone: values.adminPhone,
      contract_status: 'pending',
      payment_status: 'pending',
      registration_status: 'pending',
      pending_reason: 'user_validation'
    })
    .select()
    .single();
  
  return { data, error, planName: planData?.name, planPrice: planData?.price };
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

  return {
    id: dbOrganization.id,
    name: dbOrganization.name,
    nomeFantasia: dbOrganization.nome_fantasia || "",
    plan: dbOrganization.plan,
    planName: dbOrganization.planName || "Plano não especificado",
    users: [],
    status: allStepsCompleted ? 'active' as OrganizationStatus : status,
    pendingReason: currentPendingReason,
    contractStatus: dbOrganization.contract_status || 'pending',
    paymentStatus: dbOrganization.payment_status || 'pending',
    registrationStatus: dbOrganization.registration_status || 'pending',
    integratedCRM: dbOrganization.integrated_crm,
    integratedLLM: dbOrganization.integrated_llm,
    email: dbOrganization.admin_email || "",
    phone: dbOrganization.phone || "",
    cnpj: dbOrganization.cnpj,
    adminName: dbOrganization.admin_name,
    adminEmail: dbOrganization.admin_email,
    adminPhone: dbOrganization.admin_phone || "",
    contractSignedAt: dbOrganization.contract_signed_at,
    createdAt: dbOrganization.created_at,
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
};

/**
 * Creates a monthly title for the newly created organization
 */
export const handleMensalidadeCreation = async (organization: Organization) => {
  try {
    // Buscar o valor do plano diretamente do banco de dados
    const planType = organization.plan;
    const planValue = await getPlanValue(planType);
    
    console.log(`Criando título de mensalidade para organização ${organization.id} com valor ${planValue}`);
    
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
  // URLs diretos para as rotas específicas
  const termsUrl = `${window.location.origin}/contract/${organizationId}`;
  const paymentUrl = `${window.location.origin}/payment/${organizationId}`;
  const confirmationUrl = `${window.location.origin}/confirm-registration/${organizationId}`;

  const { error } = await supabase.functions.invoke('send-organization-emails', {
    body: {
      organizationId,
      type: 'onboarding',
      data: {
        termsUrl,
        paymentUrl,
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
