
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { User } from "@/types";
import { Shield, Users } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPermissionData } from "@/components/admin/customer-success/utils/permission-utils";
import { PermissionCategoryCard } from "@/components/admin/customer-success/components/PermissionCategoryCard";

const OrganizationUnusedPermissions = () => {
  const { user } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar os usuários da organização atual
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Em produção, isso seria uma chamada real à API
        // Simularemos usando os dados do usuário atual
        const mockUsers = user ? 
          [
            user,
            {
              ...user,
              id: "user2",
              name: "João Silva",
              email: "joao@exemplo.com",
              permissions: {
                dashboard: true,
                "dashboard.analytics": true,
                "dashboard.organizations": false,
                settings: true,
                "settings.alerts": true,
                profile: true
              }
            },
            {
              ...user,
              id: "user3",
              name: "Ana Souza",
              email: "ana@exemplo.com",
              permissions: {
                leads: true,
                profile: true,
                crm: true,
                "crm.fields": true
              }
            }
          ] : [];

        setUsers(mockUsers);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        toast.error("Não foi possível carregar os usuários");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  // Get permission data
  const activeUsers = users.filter(user => user.status === 'active');
  const permissionData = getPermissionData(activeUsers);

  // Get main categories (parent permissions without dots)
  const mainCategories = Object.keys(permissionData)
    .filter(key => !key.includes('.'))
    .sort((a, b) => permissionData[a].label.localeCompare(permissionData[b].label));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Funções sem Usuários</h1>
          <p className="text-muted-foreground">
            Visualize a distribuição das funções e abas do sistema entre os usuários ativos da sua empresa.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="space-y-6">
          <ScrollArea className="h-[calc(100vh-250px)] pr-4">
            <div className="space-y-6">
              {mainCategories.map(category => (
                <PermissionCategoryCard 
                  key={category} 
                  category={category} 
                  permissionData={permissionData} 
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default OrganizationUnusedPermissions;
