import { Organization, OrganizationStatus, User } from "@/types";
import { mockOrganizations } from "@/mocks/organizationMocks";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

// Cria uma cópia dos dados mockados para permitir modificações
let organizations: Organization[] = [...mockOrganizations];

// Busca todas as organizações
export const fetchOrganizations = async (): Promise<Organization[]> => {
  // Simula um pequeno delay para parecer uma chamada de API real
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return organizations;
};

// Busca uma organização específica por ID
export const fetchOrganizationById = async (id: string): Promise<Organization | null> => {
  // Simula um pequeno delay para parecer uma chamada de API real
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const organization = organizations.find(org => org.id === id);
  return organization || null;
};

// Cria uma nova organização
export const createOrganization = async (organizationData: Partial<Organization>): Promise<Organization> => {
  // Simula um pequeno delay para parecer uma chamada de API real
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newOrganization: Organization = {
    id: uuidv4(),
    name: organizationData.name || 'Nova Organização',
    status: organizationData.status || 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cnpj: organizationData.cnpj || '',
    address: organizationData.address || {},
    adminEmail: organizationData.adminEmail || '',
    adminName: organizationData.adminName || '',
    adminPhone: organizationData.adminPhone || '',
    logo: organizationData.logo || null,
    paymentStatus: organizationData.paymentStatus || 'pending',
    registrationStatus: organizationData.registrationStatus || 'pending',
    pendingReason: organizationData.pendingReason || null,
    setupCompleted: organizationData.setupCompleted || false,
    modules: organizationData.modules || [],
    plan: organizationData.plan || {
      id: uuidv4(),
      name: 'Plano Básico',
      price: 149.90,
      features: ['Análise de chamadas'],
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    users: organizationData.users || []
  };
  
  organizations.push(newOrganization);
  return newOrganization;
};

// Atualiza uma organização existente
export const updateOrganization = async (id: string, organizationData: Partial<Organization>): Promise<Organization | null> => {
  // Simula um pequeno delay para parecer uma chamada de API real
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const index = organizations.findIndex(org => org.id === id);
  if (index === -1) return null;
  
  const updatedOrganization = {
    ...organizations[index],
    ...organizationData,
    updatedAt: new Date().toISOString()
  };
  
  organizations[index] = updatedOrganization;
  return updatedOrganization;
};

// Atualiza o status de uma organização
export const updateOrganizationStatus = async (organizationId: string, newStatus: OrganizationStatus): Promise<boolean> => {
  // Simula um pequeno delay para parecer uma chamada de API real
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = organizations.findIndex(org => org.id === organizationId);
  if (index === -1) return false;
  
  organizations[index] = {
    ...organizations[index],
    status: newStatus,
    updatedAt: new Date().toISOString()
  };
  
  console.log(`Atualizando status da organização ${organizationId} para ${newStatus}`);
  return true;
};

// Envia contrato inicial para uma organização
export const sendInitialContract = async (organization: Organization): Promise<boolean> => {
  try {
    // Simula um pequeno delay para parecer uma chamada de API real
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const adminUser = organization.users?.find(user => user.role === "admin");
    if (!adminUser) {
      throw new Error("Usuário admin não encontrado");
    }

    // Simula a criação de um título pro rata
    console.log("Título pro rata criado para organização:", organization.name);

    // Simula o envio de email com contrato
    console.log("Enviando email com contrato para:", organization.adminEmail);
    
    toast.success(`Contrato enviado com sucesso para ${organization.adminEmail}`);
    return true;
  } catch (error) {
    console.error("Erro ao enviar contrato:", error);
    toast.error(`Erro ao enviar contrato: ${error.message}`);
    throw error;
  }
};

// Ativa uma organização
export const activateOrganization = async (organizationId: string): Promise<boolean> => {
  try {
    // Simula um pequeno delay para parecer uma chamada de API real
    await new Promise(resolve => setTimeout(resolve, 700));
    
    await updateOrganizationStatus(organizationId, "active");
    console.log(`Organização ${organizationId} ativada com sucesso`);
    toast.success("Organização ativada com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao ativar organização:", error);
    toast.error(`Erro ao ativar organização: ${error.message}`);
    throw error;
  }
};

// Desativa uma organização
export const deactivateOrganization = async (organizationId: string): Promise<boolean> => {
  try {
    // Simula um pequeno delay para parecer uma chamada de API real
    await new Promise(resolve => setTimeout(resolve, 700));
    
    await updateOrganizationStatus(organizationId, "inactive");
    console.log(`Organização ${organizationId} desativada com sucesso`);
    toast.success("Organização desativada com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao desativar organização:", error);
    toast.error(`Erro ao desativar organização: ${error.message}`);
    throw error;
  }
};

// Adiciona um usuário a uma organização
export const addUserToOrganization = async (organizationId: string, userData: Partial<User>): Promise<User | null> => {
  // Simula um pequeno delay para parecer uma chamada de API real
  await new Promise(resolve => setTimeout(resolve, 900));
  
  const orgIndex = organizations.findIndex(org => org.id === organizationId);
  if (orgIndex === -1) return null;
  
  const newUser: User = {
    id: uuidv4(),
    name: userData.name || 'Novo Usuário',
    email: userData.email || `user-${Date.now()}@example.com`,
    role: userData.role || 'seller',
    status: userData.status || 'active',
    createdAt: new Date().toISOString(),
    permissions: userData.permissions || {},
    organization: organizations[orgIndex]
  };
  
  if (!organizations[orgIndex].users) {
    organizations[orgIndex].users = [];
  }
  
  organizations[orgIndex].users?.push(newUser);
  return newUser;
};
