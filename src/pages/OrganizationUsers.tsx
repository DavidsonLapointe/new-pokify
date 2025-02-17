
import OrganizationLayout from "@/components/OrganizationLayout";
import { UsersTable } from "@/components/organization/UsersTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

// Mock de usuários para demonstração
const mockUsers = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@empresa.com",
    role: "admin",
    status: "active",
    lastAccess: "2024-02-15T10:00:00",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria.santos@empresa.com",
    role: "seller",
    status: "active",
    lastAccess: "2024-02-14T15:30:00",
  },
  {
    id: 3,
    name: "Pedro Oliveira",
    email: "pedro.oliveira@empresa.com",
    role: "seller",
    status: "inactive",
    lastAccess: "2024-02-10T09:15:00",
  },
];

const OrganizationUsers = () => {
  const handleEditUser = (user: any) => {
    console.log("Editar usuário:", user);
  };

  const handleEditPermissions = (user: any) => {
    console.log("Editar permissões:", user);
  };

  return (
    <OrganizationLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Usuários</h1>
            <p className="text-muted-foreground">
              Gerencie os usuários da sua organização
            </p>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Usuário
          </Button>
        </div>

        <UsersTable
          users={mockUsers}
          onEditUser={handleEditUser}
          onEditPermissions={handleEditPermissions}
        />
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationUsers;
