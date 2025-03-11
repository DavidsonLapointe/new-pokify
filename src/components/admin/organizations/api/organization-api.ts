
import { supabase, safeQueryResult } from "@/integrations/supabase/client";
import { CreateOrganizationFormData } from "../schema";
import { Organization, OrganizationStatus } from "@/types";
import { createProRataTitle } from "@/services/financial";
import { calculateProRataValue, getPlanValues, getPlanValue } from "../utils/calculation-utils";
import { checkExistingOrganization } from "../utils/cnpj-verification-utils";

/**
 * Creates a new organization in the database
 */
export const createOrganization = async (values: CreateOrganizationFormData) => {
  try {
    // First, get the plan name to store alongside the ID
    const { data: planData, error: planError } = await supabase
      .from('plans')
      .select('name')
      .eq('id', values.plan)
      .single();
    
    if (planError) {
      console.error("Error fetching plan details:", planError);
      return { data: null, error: planError, planName: null };
    }
    
    // Perform a simple insert without ON CONFLICT clause
    const { data, error } = await supabase
      .from('organizations')
      .insert({
        name: values.razaoSocial,
        nome_fantasia: values.nomeFantasia,
        plan: values.plan, 
        status: "pending" as OrganizationStatus,
        email: values.email,
        phone: values.phone,
        cnpj: values.cnpj,
        admin_name: values.adminName,
        admin_email: values.adminEmail,
        contract_status: 'pending',
        payment_status: 'pending',
        registration_status: 'pending'
      })
      .select()
      .single();
    
    return { 
      data, 
      error, 
      planName: planData?.name || null 
    };
  } catch (error) {
    console.error("Error in createOrganization:", error);
    return { data: null, error, planName: null };
  }
};

/**
 * Transforms database organization format to match Organization type
 */
export const mapToOrganizationType = (dbOrganization: any): Organization => {
  if (!dbOrganization) {
    throw new Error("Cannot map null or undefined organization data");
  }

  // Calculate overall status based on individual statuses
  const allStepsCompleted = 
    dbOrganization.contract_status === 'completed' && 
    dbOrganization.payment_status === 'completed' && 
    dbOrganization.registration_status === 'completed';
  
  // Determine current pending reason based on first incomplete step
  let currentPendingReason = null;
  if (dbOrganization.contract_status === 'pending') {
    currentPendingReason = 'contract_signature';
  } else if (dbOrganization.payment_status === 'pending') {
    currentPendingReason = 'pro_rata_payment';
  } else if (dbOrganization.registration_status === 'pending') {
    currentPendingReason = 'user_validation';
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
    email: dbOrganization.email,
    phone: dbOrganization.phone || "",
    cnpj: dbOrganization.cnpj,
    adminName: dbOrganization.admin_name,
    adminEmail: dbOrganization.admin_email,
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
 * Creates a pro-rata title for the newly created organization
 */
export const handleProRataCreation = async (organization: Organization) => {
  try {
    // Buscar o valor do plano diretamente do banco de dados
    const planType = organization.plan;
    const planValue = await getPlanValue(planType);
    const proRataValue = calculateProRataValue(planValue);
    
    return await createProRataTitle(organization, proRataValue);
  } catch (error) {
    console.error('Erro ao criar título pro-rata:', error);
    
    // Fallback para o método antigo em caso de erro
    const planValues = getPlanValues();
    const planType = organization.plan as keyof typeof planValues;
    const proRataValue = calculateProRataValue(planValues[planType]);
    
    return await createProRataTitle(organization, proRataValue);
  }
};

/**
 * Sends onboarding email with all necessary links
 */
export const sendOnboardingEmail = async (
  organizationId: string,
  contractUrl: string,
  confirmationToken: string,
  paymentUrl: string,
  proRataAmount: number
) => {
  // URLs diretos para as rotas específicas
  const updatedContractUrl = `${window.location.origin}/contract/${organizationId}`;
  const updatedPaymentUrl = `${window.location.origin}/payment/${organizationId}`;
  const updatedConfirmationUrl = `${window.location.origin}/confirm-registration/${organizationId}`;

  const { error } = await supabase.functions.invoke('send-organization-emails', {
    body: {
      organizationId,
      type: 'onboarding',
      data: {
        contractUrl: updatedContractUrl,
        confirmationToken: updatedConfirmationUrl,
        paymentUrl: updatedPaymentUrl,
        proRataAmount
      }
    }
  });
  
  return { error };
};

// Re-export the checkExistingOrganization function for backwards compatibility
export { checkExistingOrganization };
