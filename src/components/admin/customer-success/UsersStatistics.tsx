
import { User, UserStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/components/ui/link";
import { UsersDialog } from "./UsersDialog";
import { useState } from "react";

interface UsersStatisticsProps {
  users: User[];
}

export const UsersStatistics = ({ users }: UsersStatisticsProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<UserStatus | null>(null);

  // Agrupar usuários por status
  const usersByStatus = users.reduce((acc, user) => {
    acc[user.status] = (acc[user.status] || 0) + 1;
    return acc;
  }, {} as Record<UserStatus, number>);

  const handleViewUsers = (status: UserStatus | null) => {
    setStatusFilter(status);
    setDialogOpen(true);
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-sm text-gray-500">Total</p>
              <Link 
                className="text-primary mt-2 inline-block cursor-pointer"
                onClick={() => handleViewUsers(null)}
              >
                Ver usuários
              </Link>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold">{usersByStatus.active || 0}</p>
              <p className="text-sm text-gray-500">Ativos</p>
              <Link 
                className="text-primary mt-2 inline-block cursor-pointer"
                onClick={() => handleViewUsers('active')}
              >
                Ver usuários
              </Link>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold">{usersByStatus.pending || 0}</p>
              <p className="text-sm text-gray-500">Pendentes</p>
              <Link 
                className="text-primary mt-2 inline-block cursor-pointer"
                onClick={() => handleViewUsers('pending')}
              >
                Ver usuários
              </Link>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold">{usersByStatus.inactive || 0}</p>
              <p className="text-sm text-gray-500">Inativos</p>
              <Link 
                className="text-primary mt-2 inline-block cursor-pointer"
                onClick={() => handleViewUsers('inactive')}
              >
                Ver usuários
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <UsersDialog 
        isOpen={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        users={statusFilter ? users.filter(user => user.status === statusFilter) : users}
        statusFilter={statusFilter}
      />
    </>
  );
};
