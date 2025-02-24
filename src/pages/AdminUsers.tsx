import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { User } from "@/types";
import { mockUsers } from "@/types/mock-users";
import { useUser } from "@/contexts/UserContext";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { AddLeadlyEmployeeDialog } from "@/components/admin/users/AddLeadlyEmployeeDialog";
import { EditLeadlyEmployeeDialog } from "@/components/admin/users/EditLeadlyEmployeeDialog";
import { AdminUserPermissionsDialog } from "@/components/admin/users/AdminUserPermissionsDialog";

const AdminUsers = () => {
  const { user } = useUser();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Filtra apenas usuários do tipo leadly_employee
    const leadlyEmployees = mockUsers.filter(u => u.role === "leadly_employee");
    setUsers(leadlyEmployees);
  }, []);

  const handleAddUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
    setIsAddDialogOpen(false);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleUserUpdate = (updatedUser: User) => {
    const updatedUsers = users.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );
    setUsers(updatedUsers);
    setIsEditDialogOpen(false);
  };

  const handleEditPermissions = (user: User) => {
    setSelectedUser(user);
    setIsPermissionsDialogOpen(true);
  };

  const handlePermissionsUpdate = (updatedUser: User) => {
    handleUserUpdate(updatedUser);
    setIsPermissionsDialogOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários da Leadly
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      <UsersTable
        users={users}
        onEditUser={handleEditUser}
        onEditPermissions={handleEditPermissions}
      />

      <AddLeadlyEmployeeDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onUserAdded={handleAddUser}
      />

      {selectedUser && (
        <>
          <EditLeadlyEmployeeDialog
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            user={selectedUser}
            onUserUpdate={handleUserUpdate}
          />

          <AdminUserPermissionsDialog
            isOpen={isPermissionsDialogOpen}
            onClose={() => setIsPermissionsDialogOpen(false)}
            user={selectedUser}
            onUserUpdate={handlePermissionsUpdate}
          />
        </>
      )}
    </div>
  );
};

export default AdminUsers;
