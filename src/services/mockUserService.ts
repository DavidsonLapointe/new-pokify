import { User, UserRole, UserStatus } from "@/types";
import { mockLeadlyEmployees, mockAuthenticatedUser } from "@/mocks/userMocks";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

// Cria uma cópia dos dados mockados para permitir modificações
let users: User[] = [...mockLeadlyEmployees, mockAuthenticatedUser];

// Busca todos os usuários
export const fetchUsers = async (): Promise<User[]> => {
  // Simula um pequeno delay para parecer uma chamada de API real
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return users;
};

// Busca um usuário específico por ID
export const fetchUserById = async (id: string): Promise<User | null> => {
  // Simula um pequeno delay para parecer uma chamada de API real
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = users.find(user => user.id === id);
  return user || null;
};

// Cria um novo usuário
export const createUser = async (userData: Partial<User>): Promise<User> => {
  // Simula um pequeno delay para parecer uma chamada de API real
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newUser: User = {
    id: uuidv4(),
    name: userData.name || 'Novo Usuário',
    email: userData.email || `user-${Date.now()}@example.com`,
    phone: userData.phone,
    role: userData.role || 'seller',
    status: userData.status || 'active',
    createdAt: new Date().toISOString(),
    lastAccess: null,
    permissions: userData.permissions || {},
    logs: [],
    avatar: null,
    organization: userData.organization,
    company_leadly_id: userData.company_leadly_id,
    area: userData.area
  };
  
  users.push(newUser);
  return newUser;
};

// Atualiza um usuário existente
export const updateUser = async (id: string, userData: Partial<User>): Promise<User | null> => {
  // Simula um pequeno delay para parecer uma chamada de API real
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return null;
  
  const updatedUser = {
    ...users[index],
    ...userData,
    updatedAt: new Date().toISOString()
  };
  
  users[index] = updatedUser;
  return updatedUser;
};

// Atualiza o status de um usuário
export const updateUserStatus = async (userId: string, newStatus: UserStatus): Promise<boolean> => {
  // Simula um pequeno delay para parecer uma chamada de API real
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = users.findIndex(user => user.id === userId);
  if (index === -1) return false;
  
  users[index] = {
    ...users[index],
    status: newStatus,
    updatedAt: new Date().toISOString()
  };
  
  console.log(`Atualizando status do usuário ${userId} para ${newStatus}`);
  return true;
};

// Atualiza o papel (role) de um usuário
export const updateUserRole = async (userId: string, newRole: UserRole): Promise<boolean> => {
  // Simula um pequeno delay para parecer uma chamada de API real
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = users.findIndex(user => user.id === userId);
  if (index === -1) return false;
  
  users[index] = {
    ...users[index],
    role: newRole,
    updatedAt: new Date().toISOString()
  };
  
  console.log(`Atualizando papel do usuário ${userId} para ${newRole}`);
  return true;
};

// Atualiza as permissões de um usuário
export const updateUserPermissions = async (userId: string, permissions: { [key: string]: boolean }): Promise<boolean> => {
  // Simula um pequeno delay para parecer uma chamada de API real
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const index = users.findIndex(user => user.id === userId);
  if (index === -1) return false;
  
  users[index] = {
    ...users[index],
    permissions: {
      ...users[index].permissions,
      ...permissions
    },
    updatedAt: new Date().toISOString()
  };
  
  console.log(`Atualizando permissões do usuário ${userId}`);
  return true;
};

// Exclui um usuário
export const deleteUser = async (userId: string): Promise<boolean> => {
  // Simula um pequeno delay para parecer uma chamada de API real
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const initialLength = users.length;
  users = users.filter(user => user.id !== userId);
  
  const success = users.length < initialLength;
  if (success) {
    console.log(`Usuário ${userId} excluído com sucesso`);
    toast.success("Usuário excluído com sucesso");
  } else {
    console.error(`Usuário ${userId} não encontrado`);
    toast.error("Usuário não encontrado");
  }
  
  return success;
};
