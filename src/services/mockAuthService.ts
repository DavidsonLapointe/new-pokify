import { Session } from '@supabase/supabase-js';
import { mockAuthenticatedUser } from '@/mocks/userMocks';
import { mockOrganizations } from '@/mocks/organizationMocks';
import { User } from '@/types';

// Mock session object
export const mockSession: Session = {
  access_token: "mock-access-token",
  refresh_token: "mock-refresh-token",
  expires_in: 3600,
  expires_at: new Date().getTime() + 3600000,
  token_type: "bearer",
  user: {
    id: mockAuthenticatedUser.id,
    aud: "authenticated",
    role: "authenticated",
    email: mockAuthenticatedUser.email,
    app_metadata: {},
    user_metadata: { name: mockAuthenticatedUser.name },
    created_at: mockAuthenticatedUser.createdAt,
    updated_at: mockAuthenticatedUser.updatedAt || mockAuthenticatedUser.createdAt,
  },
};

// Simula o login com email e senha
export const signInWithEmailAndPassword = async (email: string, password: string): Promise<{ session: Session | null, user: User | null, error: Error | null }> => {
  // Simula um pequeno delay para parecer uma chamada de API real
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Verifica se o email é do usuário mockado
  if (email === mockAuthenticatedUser.email && password === 'password') {
    return {
      session: mockSession,
      user: {
        ...mockAuthenticatedUser,
        organization: mockOrganizations[0]
      },
      error: null
    };
  }
  
  // Simula um erro de autenticação
  return {
    session: null,
    user: null,
    error: new Error('Email ou senha incorretos')
  };
};

// Simula o logout
export const signOut = async (): Promise<{ error: Error | null }> => {
  // Simula um pequeno delay para parecer uma chamada de API real
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return { error: null };
};

// Simula a recuperação da sessão atual
export const getSession = async (): Promise<{ session: Session | null }> => {
  // Simula um pequeno delay para parecer uma chamada de API real
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return { session: mockSession };
};

// Simula a recuperação do usuário atual
export const getCurrentUser = async (): Promise<{ user: User | null, error: Error | null }> => {
  // Simula um pequeno delay para parecer uma chamada de API real
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return { 
    user: {
      ...mockAuthenticatedUser,
      organization: mockOrganizations[0]
    }, 
    error: null 
  };
};

// Simula o registro de um novo usuário
export const signUp = async (email: string, password: string, userData: Partial<User>): Promise<{ user: User | null, error: Error | null }> => {
  // Simula um pequeno delay para parecer uma chamada de API real
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simula um usuário recém-criado
  const newUser: User = {
    id: `user-${Date.now()}`,
    name: userData.name || 'Novo Usuário',
    email,
    role: userData.role || 'admin',
    status: 'pending',
    createdAt: new Date().toISOString(),
    permissions: {},
    organization: mockOrganizations[0]
  };
  
  return { user: newUser, error: null };
};
