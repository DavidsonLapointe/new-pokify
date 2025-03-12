import { useState, useEffect } from "react";
import { User } from "@/types/organization-types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { mockOrganizations } from "@/mocks";

export const useOrganizationUsers = (organizationId: string | undefined) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrganizationUsers = async () => {
    setLoading(true);
    
    try {
      setTimeout(() => {
        if (!organizationId) {
          setUsers([]);
          setLoading(false);
          return;
        }
      
      const organization = mockOrganizations.find(org => org.id === organizationId);
      
      if (organization) {
        const orgUsers = organization.users.map(user => ({
          ...user,
          avatar: user.avatar || null,
          lastAccess: user.lastAccess || new Date().toISOString(),
          logs: user.logs.map(log => ({
            id: log.id,
            date: log.date,
            action: log.action
          }))
        }));
        setUsers(orgUsers);
        console.log("Usuários mockados carregados:", orgUsers);
      } else {
        const firstOrg = mockOrganizations[0];
        const firstOrgUsers = firstOrg.users.map(user => ({
          ...user,
          avatar: user.avatar || null,
          lastAccess: user.lastAccess || new Date().toISOString(),
          logs: user.logs.map(log => ({
            id: log.id,
            date: log.date,
            action: log.action
          }))
        }));
        setUsers(firstOrgUsers);
      }
      
      setLoading(false);
    }, 800);
  } catch (error) {
    console.error("Erro em fetchOrganizationUsers:", error);
    toast.error("Erro ao carregar usuários");
    setLoading(false);
  }
};

  const updateUser = async (updatedUser: User) => {
    try {
      // Simula atualização do usuário
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        )
      );
      
      console.log("Usuário atualizado:", updatedUser);
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
