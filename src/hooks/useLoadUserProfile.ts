
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatUserData } from "@/utils/userUtils";
import { User } from "@/types";
import { toast } from "sonner";

export const useLoadUserProfile = (userId: string | undefined) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        console.log("Carregando perfil do usuário:", userId);
        
        // Primeiro, verificar se o perfil do usuário já existe
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select(`
            *,
            organizations:organization_id (*)
          `)
          .eq('id', userId)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Erro ao buscar perfil:", profileError);
          toast.error("Erro ao carregar perfil de usuário");
          setLoading(false);
          return;
        }

        if (!profile) {
          console.warn("Perfil não encontrado para o usuário:", userId);
          // O perfil pode não existir ainda se o handle_new_user não foi acionado
          // ou se o usuário foi criado antes de implementarmos a criação de perfil
          
          // Verificar se temos dados do usuário na auth para criar um perfil
          const { data: authUser, error: authError } = await supabase.auth.getUser();
          
          if (authError) {
            console.error("Erro ao buscar dados de autenticação:", authError);
            setLoading(false);
            return;
          }
          
          if (!authUser?.user) {
            console.error("Dados de autenticação não encontrados");
            setLoading(false);
            return;
          }
          
          console.log("Tentando criar perfil para usuário:", userId);
          
          // Criar um perfil básico baseado nos dados de auth
          // Isso normalmente aconteceria pelo trigger handle_new_user
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: authUser.user.email,
              name: authUser.user.user_metadata?.name || authUser.user.email,
              role: 'admin', // Assumir admin por padrão
              status: 'active',
              organization_id: authUser.user.user_metadata?.organization_id
            })
            .select(`
              *,
              organizations:organization_id (*)
            `)
            .single();
            
          if (createError) {
            console.error("Erro ao criar perfil:", createError);
            setLoading(false);
            return;
          }
          
          const formattedUser = formatUserData(newProfile, newProfile.organizations);
          setUser(formattedUser);
        } else {
          const formattedUser = formatUserData(profile, profile.organizations);
          setUser(formattedUser);
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        toast.error("Erro ao carregar dados do usuário");
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [userId]);

  return { user, setUser, loading };
};
