
import { User } from '../types';
import { generateRandomLogs } from './utils';
import { Organization } from '@/types/organization-types';

// Função para gerar usuários mock com diferentes funções e status
export const createMockUser = (role: User['role'] = 'seller', status: User['status'] = 'active', orgIndex: number = 0, nameIndex: number = 0): User => {
  const now = new Date().toISOString();
  const isAdmin = role === 'admin';
  
  return {
    id: `user-${Math.random().toString(36).substr(2, 9)}`,
    name: isAdmin ? `Admin ${orgIndex + 1}` : `Vendedor ${nameIndex}`,
    email: isAdmin ? `admin${orgIndex + 1}@empresa.com` : `vendedor${nameIndex}@empresa.com`,
    avatar: null,
    role,
    status,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    lastAccess: now,
    permissions: {
      dashboard: true,
      leads: true,
      users: isAdmin,
      integrations: isAdmin,
      settings: isAdmin,
      plan: isAdmin,
      company: isAdmin,
      profile: true,
    },
    logs: generateRandomLogs(10).map(log => ({
      id: log.id,
      date: log.timestamp,
      action: log.activity
    })),
  };
};

// Gera uma lista específica de usuários mock para garantir 23 usuários (1 admin + 22 vendedores)
export const generateMockUsers = (count: number, orgIndex: number = 0): User[] => {
  const users: User[] = [];
  
  // Garantir sempre 1 admin
  users.push(createMockUser('admin', 'active', orgIndex));
  
  if (count === 23) {
    // Caso especial para a primeira organização: garantir 1 admin + 22 vendedores com diferentes status
    
    // Adicionar 15 vendedores ativos
    for (let i = 1; i <= 15; i++) {
      users.push(createMockUser('seller', 'active', orgIndex, i));
    }
    
    // Adicionar 4 vendedores inativos
    for (let i = 16; i <= 19; i++) {
      users.push(createMockUser('seller', 'inactive', orgIndex, i));
    }
    
    // Adicionar 3 vendedores pendentes
    for (let i = 20; i <= 22; i++) {
      users.push(createMockUser('seller', 'pending', orgIndex, i));
    }
    
    return users;
  }
  
  // Para outras organizações, manter a lógica original
  for (let i = 1; i < count; i++) {
    const status: User['status'] = Math.random() > 0.8 
      ? (Math.random() > 0.5 ? 'inactive' : 'pending') 
      : 'active';
    
    users.push(createMockUser('seller', status, orgIndex, i));
  }
  
  return users;
};

// Variável para armazenar as organizações depois que forem criadas
let mockOrganizationsRef: Organization[] = [];

// Função para definir as organizações após serem criadas
export const setMockOrganizations = (orgs: Organization[]) => {
  mockOrganizationsRef = orgs;
};

// Criamos um usuário autenticado que será atualizado com a organização
export const createMockAuthenticatedUser = (): User => {
  const user = createMockUser('admin');
  
  // Se as organizações já estiverem disponíveis, associamos a primeira ao usuário
  if (mockOrganizationsRef.length > 0) {
    return {
      ...user,
      organization: mockOrganizationsRef[0],
    };
  }
  
  return user;
};

// Usuários mockados para uso em diferentes contextos
export const mockUsers = generateMockUsers(15);

// Mock para o usuário autenticado (será atualizado depois com a organização)
export const mockAuthenticatedUser: User = createMockAuthenticatedUser();
