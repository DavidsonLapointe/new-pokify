
import { Organization } from '@/types';

export const formatOrganizationData = (organization: any): Organization => {
  console.log("Formatando organização (dados brutos):", organization);
  
  // Verificar se os dados necessários estão presentes
  if (!organization || !organization.id || !organization.name) {
    console.error("Dados de organização inválidos:", organization);
    throw new Error("Dados de organização inválidos ou incompletos");
  }
  
  // Tratar campos opcionais explicitamente
  const nome_fantasia = organization.nome_fantasia || '';
  const contract_signed_at = organization.contract_signed_at || null;
  const integrated_crm = organization.integrated_crm || null;
  const integrated_llm = organization.integrated_llm || null;
  const phone = organization.phone || '';
  
  // Determine pending reason based on individual statuses
  let pendingReason = null;
  if (organization.contract_status === 'pending') {
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

  // Criar objeto de organização formatado com valores padrão para campos opcionais
  const formattedOrg: Organization = {
    id: organization.id,
    name: organization.name,
    nomeFantasia: nome_fantasia,
    plan: organization.plan,
    users: organization.users || [],
    status: organization.status,
    pendingReason: pendingReason,
    integratedCRM: integrated_crm,
    integratedLLM: integrated_llm,
    email: organization.email,
    phone: phone,
    cnpj: organization.cnpj,
    adminName: organization.admin_name,
    adminEmail: organization.admin_email,
    contractSignedAt: contract_signed_at,
    createdAt: organization.created_at || new Date().toISOString(),
    logo: logo,
    address: address
  };
  
  console.log("Organização formatada com sucesso:", formattedOrg);
  return formattedOrg;
};
