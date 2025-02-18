
import { UsersTable } from "@/components/organization/UsersTable";
import { User } from "@/types/organization";
import { toast } from "sonner";

interface SellersTabContentProps {
  sellers: User[];
}

export const SellersTabContent = ({ sellers }: SellersTabContentProps) => {
  const handleEditUser = (user: User) => {
    toast.info("Funcionalidade em desenvolvimento");
  };

  const handleEditPermissions = (user: User) => {
    toast.info("Funcionalidade em desenvolvimento");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Vendedores</h2>
        <p className="text-muted-foreground">
          Gerenciamento de vendedores e suas permissões
        </p>
      </div>

      <UsersTable
        users={sellers}
        onEditUser={handleEditUser}
        onEditPermissions={handleEditPermissions}
      />
    </div>
  );
};
