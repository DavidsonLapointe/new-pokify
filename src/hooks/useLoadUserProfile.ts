
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { formatUserData } from '@/utils/userUtils';
import { formatOrganizationData } from '@/utils/organizationUtils';

export const useLoadUserProfile = (sessionUserId: string | undefined) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!sessionUserId) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        console.log("Carregando perfil do usuário:", sessionUserId);
        
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
            organization_id,
            company_leadly_id
          `)
          .eq('id', sessionUserId)
          .maybeSingle();

        if (profileError) throw profileError;
        if (!profile) throw new Error("Perfil não encontrado");

        if (profile.role === 'leadly_employee') {
          console.log("Carregando perfil de funcionário Leadly");
          const userData = formatUserData(profile);
          console.log("Dados do funcionário Leadly carregados:", userData);
          setUser(userData);
        } 
        else if (profile.organization_id) {
          const { data: organization, error: orgError } = await supabase
            .from('organizations')
            .select('*')
            .eq('id', profile.organization_id)
            .maybeSingle();

          if (orgError) throw orgError;
          if (!organization) throw new Error("Organização não encontrada");

          const formattedOrganization = formatOrganizationData(organization);
          const userData = formatUserData(profile, formattedOrganization);
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
  }, [sessionUserId, navigate]);

  return { user, setUser, loading };
};
