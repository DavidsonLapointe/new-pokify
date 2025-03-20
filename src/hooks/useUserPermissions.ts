
import { User } from "@/types";
import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Define the parent-child relationship for nested permissions
const permissionRelationships: Record<string, string[]> = {
  dashboard: ["dashboard.analytics", "dashboard.organizations", "dashboard.financial"],
  organizations: ["organizations.manage", "organizations.support"],
  modules: ["modules.manage", "modules.setups"],
  "credit-packages": ["credit-packages.manage", "credit-packages.sales"],
  financial: ["financial.invoices", "financial.reports"]
};

export const useUserPermissions = (
  user: User | null,
  isOpen: boolean,
  onClose: () => void,
  onUserUpdate: (user: User) => void
) => {
  const { user: currentUser, updateUser: updateCurrentUser } = useUser();
  const [saving, setSaving] = useState(false);
  const [tempPermissions, setTempPermissions] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (isOpen && user) {
      // Set default permissions with profile always enabled
      const defaultPermissions = {
        profile: true,
        ...user.permissions
      };
      
      setTempPermissions(defaultPermissions);
    } else {
      setTempPermissions({});
    }
  }, [isOpen, user]);

  const handlePermissionChange = (permissionId: string) => {
    if (permissionId === 'profile') return; // Profile permission can't be changed

    setTempPermissions(prev => {
      const newPermissions = { ...prev };
      
      // Toggle the permission
      newPermissions[permissionId] = !prev[permissionId];
      
      // If this is a parent permission being disabled
      if (!newPermissions[permissionId] && permissionRelationships[permissionId]) {
        // Disable all child permissions
        permissionRelationships[permissionId].forEach(childId => {
          newPermissions[childId] = false;
        });
      }
      
      // If this is a child permission being enabled
      if (newPermissions[permissionId] && permissionId.includes('.')) {
        const parentId = permissionId.split('.')[0];
        // Enable the parent permission
        newPermissions[parentId] = true;
      }

      // If this is a child permission being disabled, check if we need to disable the parent
      if (!newPermissions[permissionId] && permissionId.includes('.')) {
        const parentId = permissionId.split('.')[0];
        // Check if all sibling permissions are also disabled
        const allSiblingsDisabled = permissionRelationships[parentId]?.every(
          childId => !newPermissions[childId]
        );
        
        // If all children are disabled, you might want to disable the parent as well
        // This is optional and depends on the business logic
        if (allSiblingsDisabled) {
          // Uncomment the following line if you want to disable the parent when all children are disabled
          // newPermissions[parentId] = false;
        }
      }

      return newPermissions;
    });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    
    try {
      // Ensure profile permission is always true
      const finalPermissions = {
        ...tempPermissions,
        profile: true
      };
      
      // In a real app, this would update the database
      const { data, error } = await supabase
        .from('profiles')
        .update({
          permissions: finalPermissions
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Ensure the permissions are of the correct type
      const permissions = data.permissions as { [key: string]: boolean };

      // Update the user with the new permissions
      const updatedUser: User = {
        ...user,
        permissions
      };

      // Update the user in the context if it's the current user
      if (currentUser && user.id === currentUser.id) {
        updateCurrentUser(updatedUser);
      }

      onUserUpdate(updatedUser);
      onClose();
      toast.success("Permissões atualizadas com sucesso");
    } catch (error) {
      console.error("Erro ao salvar permissões:", error);
      toast.error("Erro ao atualizar permissões");
    } finally {
      setSaving(false);
    }
  };

  return {
    saving,
    tempPermissions,
    handlePermissionChange,
    handleSave,
    handleClose: onClose,
  };
};
