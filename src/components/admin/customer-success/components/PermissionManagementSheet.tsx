
import { useEffect, useState } from "react";
import { 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription, 
  SheetFooter 
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
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Gerenciar Acesso - {label}</SheetTitle>
        <SheetDescription>
          Defina quais usuários têm acesso a esta função. Usuários inativos não são exibidos.
        </SheetDescription>
      </SheetHeader>
      
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-220px)] mt-6 pr-4">
          <div className="space-y-4">
            {activeUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhum usuário ativo ou pendente encontrado
              </p>
            ) : (
              activeUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name || user.email}</span>
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                    <div className="mt-1">
                      <Badge 
                        variant={user.status === 'active' ? 'success' : 'warning'}
                        className="text-xs"
                      >
                        {user.status === 'active' ? 'Ativo' : 'Pendente'}
                      </Badge>
                    </div>
                  </div>
                  <Switch
                    checked={userPermissions[user.id] || false}
                    onCheckedChange={() => handlePermissionToggle(user.id)}
                  />
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      )}
      
      <SheetFooter className="mt-6">
        <Button 
          onClick={handleSave} 
          disabled={saving || loading}
          className="w-full"
        >
          {saving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </SheetFooter>
    </SheetContent>
  );
};
