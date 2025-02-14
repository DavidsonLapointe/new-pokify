
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import OrganizationLayout from "@/components/OrganizationLayout";
import { toast } from "sonner";
import { AddUserDialog } from "@/components/organization/AddUserDialog";
import { EditUserDialog } from "@/components/organization/EditUserDialog";
import { UserPermissionsDialog } from "@/components/organization/UserPermissionsDialog";
import { UsersTable } from "@/components/organization/UsersTable";
import { mockUsers } from "@/types/organization";
import type { User } from "@/types/organization";

const OrganizationUsers = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserUpdate = (updatedUser: User) => {
    const updatedUsers = users.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );
    setUsers(updatedUsers);
    toast.success("Usuário atualizado com sucesso!");
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  const handleEditPermissions = (user: User) => {
    setSelectedUser(user);
    setIsPermissionsOpen(true);
  };

  return (
    <OrganizationLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold">Usuários</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os usuários da sua organização
            </p>
          </div>

          <AddUserDialog onUserAdded={() => console.log("Usuário adicionado")} />
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <UsersTable
          users={filteredUsers}
          onEditUser={handleEditUser}
          onEditPermissions={handleEditPermissions}
        />

        <EditUserDialog
          isOpen={isEditUserOpen}
          onClose={() => setIsEditUserOpen(false)}
          user={selectedUser}
          onUserUpdate={handleUserUpdate}
        />

        <UserPermissionsDialog
          isOpen={isPermissionsOpen}
          onClose={() => setIsPermissionsOpen(false)}
          user={selectedUser}
          onUserUpdate={handleUserUpdate}
        />
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationUsers;
