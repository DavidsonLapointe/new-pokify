
import { useState, useEffect } from "react";
import { User } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useOrganizationUsers = (organizationId: string | undefined) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrganizationUsers = async () => {
    if (!organizationId) {
      setLoading(false);
      return;
    }

    try {
      const { data: profiles, error } = await supabase
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
          avatar,
          organization_id
        `)
        .eq('organization_id', organizationId);

      if (error) {
        console.error("Error fetching users:", error);
        toast.error("Erro ao carregar usuários");
        setLoading(false);
        return;
      }

      if (!profiles) {
        setUsers([]);
        setLoading(false);
        return;
      }

      const formattedUsers: User[] = profiles.map(profile => {
        let formattedPermissions: { [key: string]: boolean } = {};
        
        if (profile.permissions && typeof profile.permissions === 'object') {
          formattedPermissions = Object.entries(profile.permissions).reduce(
            (acc, [key, value]) => ({
              ...acc,
              [key]: Boolean(value)
            }),
            {}
          );
        }

        return {
          id: profile.id,
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          role: profile.role || 'seller',
          status: profile.status || 'active',
          createdAt: profile.created_at,
          lastAccess: profile.last_access || profile.created_at,
          permissions: formattedPermissions,
          logs: [],
          avatar: profile.avatar || ''
        };
      });

      console.log("Usuários carregados:", formattedUsers);
      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error in fetchOrganizationUsers:", error);
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updatedUser: User) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          role: updatedUser.role,
          permissions: updatedUser.permissions,
          status: updatedUser.status
        })
        .eq('id', updatedUser.id);

      if (error) throw error;
      
      toast.success("Usuário atualizado com sucesso");
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Erro ao atualizar usuário");
      return false;
    }
  };

  return {
    users,
    loading,
    fetchOrganizationUsers,
    updateUser
  };
};
