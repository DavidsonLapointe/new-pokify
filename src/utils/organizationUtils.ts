import { Organization, OrganizationStatus, OrganizationPendingReason, User as OrgUser } from '@/types/organization-types';

export const formatOrganizationData = (organization: any): Organization => {
  console.log("Formatando organização (dados brutos):", organization);
  
  // Verificar se os dados necessários estão presentes
  if (!organization || !organization.id) {
    console.error("Dados de organização inválidos:", organization);
    throw new Error("Dados de organização inválidos ou incompletos");
  }
  
  // Tratar campos opcionais explicitamente
  const name = organization.name || organization.razao_social || '';
  const nome_fantasia = organization.nome_fantasia || '';
  const contract_signed_at = organization.contract_signed_at || null;
  const integrated_crm = organization.integrated_crm || null;
  const integrated_llm = organization.integrated_llm || null;
  const phone = organization.phone || '';
  const admin_phone = organization.admin_phone || '';
  
  // Determine pending reason based on individual statuses
  let pendingReason: OrganizationPendingReason = null;
  if (organization.pending_reason) {
    pendingReason = organization.pending_reason;
  } else if (organization.contract_status === 'pending') {
    pendingReason = 'contract_signature';
  } else if (organization.payment_status === 'pending') {
    pendingReason = 'pro_rata_payment';
  } else if (organization.registration_status === 'pending') {
    pendingReason = 'user_validation';
  }
  
  // Verificar campos que podem ser undefined para evitar serializações incorretas
  let logo = undefined;
  if (organization.logo !== null && organization.logo !== undefined) {
    logo = organization.logo;
  }
  
  // Verificar se há dados de endereço
  let address = undefined;
  if (organization.logradouro) {
    address = {
      logradouro: organization.logradouro,
      numero: organization.numero || '',
      complemento: organization.complemento || '',
      bairro: organization.bairro || '',
      cidade: organization.cidade || '',
      estado: organization.estado || '',
      cep: organization.cep || '',
    };
  }

  // Status sempre será um dos três valores enum definidos
  const status = (organization.status || 'pending') as OrganizationStatus;

  // Ensure users have the required permissions field
  const users = Array.isArray(organization.users) ? organization.users.map((user: any) => {
    return {
      ...user,
      permissions: user.permissions || {}
    };
  }) : [];

  // Handle planName - ensure it's properly extracted from various possible sources
  const planName = organization.planName || 
                  organization.plan_name || 
                  (typeof organization.plan === 'object' && organization.plan.name) || 
                  "Plano não especificado";
  
  console.log("Usando planName:", planName);
  
  // Criar objeto de organização formatado com valores padrão para campos opcionais
  const formattedOrg: Organization = {
    id: organization.id,
    name: name,
    nomeFantasia: nome_fantasia,
    plan: organization.plan,
    planName: planName,
    users: users,
    status: status,
    pendingReason: pendingReason,
    contractStatus: organization.contract_status || 'pending',
    paymentStatus: organization.payment_status || 'pending',
    registrationStatus: organization.registration_status || 'pending',
    integratedCRM: integrated_crm,
    integratedLLM: integrated_llm,
    email: organization.email || organization.admin_email || '',
    phone: phone,
    cnpj: organization.cnpj || '',
    adminName: organization.admin_name || '',
    adminEmail: organization.admin_email || '',
    adminPhone: admin_phone,
    contractSignedAt: contract_signed_at,
    createdAt: organization.created_at || new Date().toISOString(),
    logo: logo,
    address: address
  };
  
  console.log("Organização formatada com sucesso:", formattedOrg);
  return formattedOrg;
};
