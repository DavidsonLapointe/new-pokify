
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Shield, Users } from "lucide-react";
import { PermissionsDistributionModal } from "@/components/admin/customer-success/PermissionsDistributionModal";
import { useUser } from "@/contexts/UserContext";

const OrganizationUnusedPermissions = () => {
  const { user } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(true);

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

  const openPermissionsModal = () => {
    setIsPermissionsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Funções sem Usuários</h1>
          <p className="text-muted-foreground">
            Visualize as funções e abas do sistema que não possuem usuários atribuídos.
          </p>
        </div>
        
        {!isPermissionsModalOpen && (
          <Button onClick={openPermissionsModal} className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Visualizar Permissões
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[300px]">
          <PermissionsDistributionModal
            isOpen={isPermissionsModalOpen}
            onClose={() => setIsPermissionsModalOpen(false)}
            users={users}
            organizationName={user?.company?.name}
          />
        </div>
      )}
    </div>
  );
};

export default OrganizationUnusedPermissions;
