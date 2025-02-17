
import OrganizationLayout from "@/components/OrganizationLayout";
import { UsersTable } from "@/components/organization/UsersTable";
import { AddUserDialog } from "@/components/organization/AddUserDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { mockUsers } from "@/types/organization";
import type { User } from "@/types/organization";
import { toast } from "sonner";

const OrganizationUsers = () => {
  const handleEditUser = (user: User) => {
    console.log("Editar usuário:", user);
  };

  const handleEditPermissions = (user: User) => {
    console.log("Editar permissões:", user);
  };

  const handleUserAdded = () => {
    // Aqui você pode atualizar a lista de usuários
    toast.success("Usuário adicionado com sucesso!");
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
          <AddUserDialog onUserAdded={handleUserAdded} />
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
