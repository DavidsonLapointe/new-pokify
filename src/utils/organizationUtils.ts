
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
  const pending_reason = organization.pending_reason === 'null' || !organization.pending_reason 
    ? null 
    : organization.pending_reason;
  const contract_signed_at = organization.contract_signed_at || null;
  const integrated_crm = organization.integrated_crm || null;
  const integrated_llm = organization.integrated_llm || null;
  const phone = organization.phone || '';
  const logo = organization.logo || undefined;

  // Criar objeto de organização formatado com valores padrão para campos opcionais
  const formattedOrg: Organization = {
    id: organization.id,
    name: organization.name,
    nomeFantasia: nome_fantasia,
    plan: organization.plan,
    users: organization.users || [],
    status: organization.status,
    pendingReason: pending_reason,
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
    address: organization.logradouro ? {
      logradouro: organization.logradouro,
      numero: organization.numero || '',
      complemento: organization.complemento || '',
      bairro: organization.bairro || '',
      cidade: organization.cidade || '',
      estado: organization.estado || '',
      cep: organization.cep || '',
    } : undefined
  };
  
  console.log("Organização formatada com sucesso:", formattedOrg);
  return formattedOrg;
};
