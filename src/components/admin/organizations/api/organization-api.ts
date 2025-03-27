import { supabase } from "@/integrations/supabase/realClient";
import { type CreateOrganizationFormData } from "../schema";
import { Organization, OrganizationPlan, OrganizationStatus } from "@/types/organization-types";
import { addDays, endOfMonth, format, startOfMonth, differenceInDays } from "date-fns";

/**
 * Creates a new organization in the database
 */
export const createOrganization = async (values: CreateOrganizationFormData) => {
  try {
    console.log("Criando organização com dados:", values);
    
    // Clean CNPJ before inserting (remove non-numeric characters)
    const cleanedCnpj = values.cnpj.replace(/[^0-9]/g, '');
    
    // Fetch plan name for the selected plan ID
    const { data: planData, error: planError } = await supabase
      .from('modulos')
      .select('name, value')
      .eq('id', values.plan)
      .single();
      
    if (planError) {
      console.error("Erro ao buscar detalhes do plano:", planError);
      return { data: null, error: planError, planName: null };
    }
    
    // Convert modules array to comma-separated string for storage
    const modulesString = values.modules && values.modules.length > 0 
      ? values.modules.join(',') 
      : null;
    
    // Insert the new organization
    // Note: Field names must match the database column names
    const { data, error } = await supabase
      .from('organization')
      .insert({
        razao_social: values.razaoSocial,
        nome_fantasia: values.nomeFantasia,
        cnpj: cleanedCnpj,
        email_empresa: values.email,
        telefone_empresa: values.phone,
        plano_id: values.plan,
        user_admin_id: values.adminEmail, // Using admin email as temporary user admin ID
        // Store selected modules as comma-separated list if provided
        modulos_ids: modulesString
      })
      .select('*')
      .single();
    
    if (error) {
      console.error("Erro ao criar organização:", error);
      return { data: null, error, planName: null };
    }
    
    return { 
      data, 
      error: null, 
      planName: planData?.name || null,
      planPrice: planData?.value || 0
    };
  } catch (error) {
    console.error("Erro inesperado ao criar organização:", error);
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
        .from('modulos')
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
    console.log(`Enviando email de onboarding para a organização: ${organizationId}`);
    
    // Get module names if modules were selected
    let moduleNames: string[] = [];
    
    if (selectedModules && selectedModules.length > 0) {
      // Handle module lookup differently since "modules" is not a direct table
      // Instead, we'll use hardcoded module names or fetch from a different source
      // For now, we'll just pass the raw module IDs as names
      moduleNames = selectedModules;
      
      console.log(`Módulos selecionados para o email: ${moduleNames.join(', ')}`);
    }

    const { error } = await supabase.functions.invoke('send-organization-emails', {
      body: {
        organizationId: organizationId,
        type: "onboarding",
        data: {
          contractUrl: contractLink,
          confirmationToken: confirmRegistrationLink,
          paymentUrl: paymentLink,
          proRataAmount: proRataValue,
          selectedModules: moduleNames  // Pass module names to the email function
        }
      },
    });

    if (error) {
      console.error("Erro ao enviar email de onboarding:", error);
      return { error };
    }

    console.log("Email de onboarding enviado com sucesso");
    return { error: null };
  } catch (error) {
    console.error("Erro ao chamar a função de email de onboarding:", error);
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
