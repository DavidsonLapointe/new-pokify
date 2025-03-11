
import { Organization, OrganizationPendingReason } from "@/types/organization-types";

/**
 * Formats and converts raw organization data from Supabase to the Organization type
 */
export const formatOrganizationData = (rawData: any): Organization => {
  // Map pending_reason to the correct type
  let pendingReason: OrganizationPendingReason = null;
  if (rawData.pending_reason) {
    // Ensure the value exactly matches one of the defined enum values
    if (["contract_signature", "mensalidade_payment", "user_validation"].includes(rawData.pending_reason)) {
      pendingReason = rawData.pending_reason as OrganizationPendingReason;
    }
  }

  // Create address object if address fields are present
  const address = rawData.logradouro ? {
    logradouro: rawData.logradouro || '',
    numero: rawData.numero || '',
    complemento: rawData.complemento || '',
    bairro: rawData.bairro || '',
    cidade: rawData.cidade || '',
    estado: rawData.estado || '',
    cep: rawData.cep || ''
  } : undefined;

  return {
    id: rawData.id,
    name: rawData.name,
    nomeFantasia: rawData.nome_fantasia,
    plan: rawData.plan,
    planName: rawData.planName || rawData.plan,
    users: rawData.users || [],
    status: rawData.status,
    pendingReason: pendingReason,
    contractStatus: rawData.contract_status || 'pending',
    paymentStatus: rawData.payment_status || 'pending',
    registrationStatus: rawData.registration_status || 'pending',
    integratedCRM: rawData.integrated_crm,
    integratedLLM: rawData.integrated_llm,
    email: rawData.email,
    phone: rawData.phone,
    cnpj: rawData.cnpj,
    adminName: rawData.admin_name,
    adminEmail: rawData.admin_email,
    adminPhone: rawData.admin_phone,
    contractSignedAt: rawData.contract_signed_at,
    createdAt: rawData.created_at,
    logo: rawData.logo,
    address
  };
};
