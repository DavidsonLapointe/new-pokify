
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface UserContextType {
  user: User | null;
  loading: boolean;
  updateUser: (newUser: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!session?.user) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        console.log("Carregando perfil do usuário:", session.user.id);
        
        // Primeiro, busca o perfil do usuário
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select(`
            id,
            name,
            email,
            phone,
            role,
            status,
            permissions,
            created_at,
            last_access,
            organization_id
          `)
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) throw profileError;
        if (!profile) throw new Error("Perfil não encontrado");

        // Se temos um organization_id, busca os dados da organização
        if (profile.organization_id) {
          const { data: organization, error: orgError } = await supabase
            .from('organizations')
            .select('*')
            .eq('id', profile.organization_id)
            .maybeSingle();

          if (orgError) throw orgError;
          if (!organization) throw new Error("Organização não encontrada");

          const permissions = profile.permissions as { [key: string]: boolean } || {};

          const formattedOrganization = {
            id: organization.id,
            name: organization.name,
            nomeFantasia: organization.nome_fantasia || '',
            plan: organization.plan,
            users: [], // Será preenchido posteriormente se necessário
            status: organization.status,
            pendingReason: organization.pending_reason,
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

          const userData: User = {
            id: profile.id,
            name: profile.name || '',
            email: profile.email || '',
            phone: profile.phone || '',
            role: profile.role || 'seller',
            status: profile.status || 'active',
            createdAt: profile.created_at,
            lastAccess: profile.last_access,
            permissions: permissions,
            logs: [],
            avatar: '',
            organization: formattedOrganization
          };

          console.log("Dados do usuário carregados:", userData);
          setUser(userData);
        }
      } catch (error) {
        console.error('Erro ao carregar perfil do usuário:', error);
        toast.error('Erro ao carregar perfil do usuário');
        await supabase.auth.signOut();
        setUser(null);
        navigate('/', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [session, navigate]);

  const updateUser = async (newUser: User) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          avatar: newUser.avatar,
          role: newUser.role,
        })
        .eq('id', newUser.id);

      if (error) throw error;

      setUser(newUser);
      toast.success('Perfil atualizado com sucesso');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Erro ao atualizar perfil');
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
