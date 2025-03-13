
import { Organization, OrganizationStatus, OrganizationPendingReason } from '../types/organization-types';
import { User, UserRole, UserStatus } from '../types/user-types';
import { generateMockUsers, setMockOrganizations } from './userMocks';
import { generateRandomCNPJ } from './utils';

// Cria uma organização mock com diferentes status
export const createMockOrganization = (
  index: number,
  status: OrganizationStatus = 'active',
  userCount: number = 5
): Organization => {
  const id = `org-${Math.random().toString(36).substr(2, 9)}`;
  // Para a primeira organização, sempre garantir 23 usuários
  const actualUserCount = index === 0 ? 23 : userCount;
  
  // We need to transform the User[] from userMocks to match Organization.users
  const mockUsers = generateMockUsers(actualUserCount, index);
  const now = new Date().toISOString();

  const mockPlans = [
    { id: 'basic', name: 'Plano Básico', price: 99.90 },
    { id: 'standard', name: 'Plano Padrão', price: 199.90 },
    { id: 'premium', name: 'Plano Premium', price: 299.90 }
  ];

  const pendingReasons = [
    "contract_signature", "user_validation", "mensalidade_payment", "pro_rata_payment", null
  ] as const;

  const pendingReason: OrganizationPendingReason = 
    status === 'pending' ? pendingReasons[index % pendingReasons.length] : null;

  return {
    id,
    name: `Organização ${index + 1} Ltda.`,
    nomeFantasia: `Org ${index + 1}`,
    plan: mockPlans[index % 3],
    planName: mockPlans[index % 3].name,
    users: mockUsers as any[], // Type assertion here as we know the structure is compatible
    status,
    pendingReason,
    contractStatus: status === 'active' ? 'completed' : 'pending',
    paymentStatus: status === 'active' ? 'completed' : 'pending',
    registrationStatus: status === 'active' ? 'completed' : 'pending',
    integratedCRM: status === 'active' ? (Math.random() > 0.5 ? 'hubspot' : 'pipedrive') : undefined,
    integratedLLM: status === 'active' ? 'openai' : undefined,
    email: `contato@organizacao${index + 1}.com.br`,
    phone: `(11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
    cnpj: generateRandomCNPJ(),
    adminName: mockUsers.find(u => u.role === 'admin')?.name || 'Admin',
    adminEmail: mockUsers.find(u => u.role === 'admin')?.email || `admin${index + 1}@empresa.com`,
    contractSignedAt: status === 'active' ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() : null,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    logo: Math.random() > 0.7 ? `https://ui-avatars.com/api/?name=Org+${index + 1}&background=random` : undefined,
    address: {
      logradouro: 'Av. Paulista',
      numero: `${Math.floor(Math.random() * 2000) + 1}`,
      complemento: `Sala ${Math.floor(Math.random() * 100) + 1}`,
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: `01311-${Math.floor(Math.random() * 900) + 100}`
    }
  };
};

// Gera uma lista de organizações mock com diferentes status
export const generateMockOrganizations = (count: number): Organization[] => {
  const organizations: Organization[] = [];
  
  for (let i = 0; i < count; i++) {
    const status: OrganizationStatus = 
      i % 5 === 0 ? 'pending' : 
      i % 7 === 0 ? 'inactive' : 
      'active';
    
    organizations.push(createMockOrganization(i, status, Math.floor(Math.random() * 10) + 3));
  }
  
  return organizations;
};

// Exporta organizações mockadas para uso em diferentes contextos
export const mockOrganizations = generateMockOrganizations(20);

// Atualiza a referência nas userMocks
setMockOrganizations(mockOrganizations);
