
import { User } from '@/types';
import { Organization } from '@/types/organization-types';

export const getInitialUserState = (): User | null => null;

export const formatOrganizationData = (organization: any): Organization => {
  console.log("Formatando organização:", organization.name, organization);
  
  const convertedPendingReason = organization.pending_reason === 'null' || !organization.pending_reason 
    ? null 
    : organization.pending_reason;

  return {
    id: organization.id,
    name: organization.name,
    nomeFantasia: organization.nome_fantasia || '',
    plan: organization.plan,
    users: organization.users || [],
    status: organization.status,
    pendingReason: convertedPendingReason,
    integratedCRM: organization.integrated_crm,
    integratedLLM: organization.integrated_llm,
    email: organization.email,
    phone: organization.phone || '',
    cnpj: organization.cnpj,
    adminName: organization.admin_name,
    adminEmail: organization.admin_email,
    contractSignedAt: organization.contract_signed_at,
    createdAt: organization.created_at || new Date().toISOString(),
    logo: organization.logo,
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
};

export const formatUserData = (profile: any, organization?: Organization): User => {
  const baseUserData = {
    id: profile.id,
    name: profile.name || '',
    email: profile.email || '',
    phone: profile.phone || '',
    role: profile.role,
    status: profile.status || 'active',
    createdAt: profile.created_at,
    lastAccess: profile.last_access,
    permissions: profile.permissions as { [key: string]: boolean } || {},
    logs: [],
    avatar: '',
  };

  if (profile.role === 'leadly_employee') {
    return {
      ...baseUserData,
      company_leadly_id: profile.company_leadly_id
    };
  }

  return {
    ...baseUserData,
    organization
  };
};
