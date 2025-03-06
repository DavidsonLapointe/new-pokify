
import { supabase } from "@/integrations/supabase/client";
import { CreateOrganizationFormData } from "../schema";
import { Organization } from "@/types";
import { createProRataTitle } from "@/services/financial";
import { calculateProRataValue, getPlanValues } from "../utils/calculation-utils";

/**
 * Checks if an organization with the given CNPJ already exists
 */
export const checkExistingOrganization = async (cnpj: string) => {
  const { data, error } = await supabase
    .from('organizations')
    .select('id')
    .eq('cnpj', cnpj)
    .maybeSingle();
  
  return { data, error };
};

/**
 * Creates a new organization in the database
 */
export const createOrganization = async (values: CreateOrganizationFormData) => {
  const { data, error } = await supabase
    .from('organizations')
    .insert({
      name: values.razaoSocial,
      nome_fantasia: values.nomeFantasia,
      plan: values.plan,
      status: "pending",
      pending_reason: "contract_signature",
      email: values.email,
      phone: values.phone,
      cnpj: values.cnpj,
      admin_name: values.adminName,
      admin_email: values.adminEmail,
    })
    .select()
    .single();
  
  return { data, error };
};

/**
 * Transforms database organization format to match Organization type
 */
export const mapToOrganizationType = (dbOrganization: any): Organization => {
  return {
    id: dbOrganization.id,
    name: dbOrganization.name,
    nomeFantasia: dbOrganization.nome_fantasia || "",
    plan: dbOrganization.plan,
    users: [],
    status: dbOrganization.status,
    pendingReason: dbOrganization.pending_reason,
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
  const planValues = getPlanValues();
  const planType = organization.plan as keyof typeof planValues;
  const proRataValue = calculateProRataValue(planValues[planType]);
  
  return await createProRataTitle(organization, proRataValue);
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
  const { error } = await supabase.functions.invoke('send-organization-emails', {
    body: {
      organizationId,
      type: 'onboarding',
      data: {
        contractUrl,
        confirmationToken,
        paymentUrl,
        proRataAmount
      }
    }
  });
  
  return { error };
};
