
import { useEffect, useState } from "react";
import { 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types";
import { useOrganizationUsers } from "@/hooks/useOrganizationUsers";
import { toast } from "sonner";

interface PermissionManagementSheetProps {
  permissionKey: string;
  label: string;
}

export const PermissionManagementSheet = ({ 
  permissionKey, 
  label 
}: PermissionManagementSheetProps) => {
  const { users, loading, updateUser } = useOrganizationUsers();
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [userPermissions, setUserPermissions] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  // Filter active and pending users
  useEffect(() => {
    const filteredUsers = users.filter(user => 
      user.status === 'active' || user.status === 'pending'
    );
    setActiveUsers(filteredUsers);
    
    // Initialize permissions state
    const initialPermissions: Record<string, boolean> = {};
    filteredUsers.forEach(user => {
      initialPermissions[user.id] = !!(user.permissions && user.permissions[permissionKey]);
    });
    setUserPermissions(initialPermissions);
  }, [users, permissionKey]);

  const handlePermissionToggle = (userId: string) => {
    setUserPermissions(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      let successCount = 0;
      
      // Update each user's permissions
      for (const user of activeUsers) {
        const hasPermission = userPermissions[user.id];
        
        // Create a copy of the user's current permissions or initialize an empty object
        const updatedPermissions = { ...(user.permissions || {}) };
        
        // Update the specific permission
        updatedPermissions[permissionKey] = hasPermission;
        
        // Create updated user object
        const updatedUser = {
          ...user,
          permissions: updatedPermissions
        };
        
        // Update the user
        const success = await updateUser(updatedUser);
        if (success) successCount++;
      }
      
      if (successCount > 0) {
        toast.success(`Permissões atualizadas com sucesso para ${successCount} usuário(s)`);
      } else {
        toast.error("Nenhuma permissão foi atualizada");
      }
    } catch (error) {
      console.error("Erro ao atualizar permissões:", error);
      toast.error("Erro ao atualizar permissões");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SheetContent className="sm:max-w-md flex flex-col h-[500px] max-h-[80vh]">
      <SheetHeader className="mb-2">
        <SheetTitle className="text-base">Gerenciar Acesso - {label}</SheetTitle>
        <SheetDescription className="text-xs">
          Defina quais usuários têm acesso a esta função. Usuários inativos não são exibidos.
        </SheetDescription>
      </SheetHeader>
      
      {loading ? (
        <div className="flex items-center justify-center h-24">
          <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : (
        <ScrollArea className="flex-grow pr-2 mb-3">
          <div className="space-y-2">
            {activeUsers.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                Nenhum usuário ativo ou pendente encontrado
              </p>
            ) : (
              activeUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{user.name || user.id}</span>
                    <Badge 
                      variant={user.status === 'active' ? 'success' : 'warning'}
                      className="text-[10px] px-1.5 py-0"
                    >
                      {user.status === 'active' ? 'Ativo' : 'Pendente'}
                    </Badge>
                  </div>
                  <Switch
                    checked={userPermissions[user.id] || false}
                    onCheckedChange={() => handlePermissionToggle(user.id)}
                    className="ml-2"
                  />
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      )}
      
      <Button 
        onClick={handleSave} 
        disabled={saving || loading}
        className="w-full text-sm py-2 mt-auto"
      >
        {saving ? "Salvando..." : "Salvar alterações"}
      </Button>
    </SheetContent>
  );
};
