
import { User, UserStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UsersDialog } from "./UsersDialog";
import { useState } from "react";

interface UsersStatisticsProps {
  users: User[];
  organizationName?: string;
}

export const UsersStatistics = ({ users, organizationName }: UsersStatisticsProps) => {
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
              <Button 
                variant="link" 
                className="text-primary text-xs p-0 h-auto mt-2 hover:underline"
                onClick={() => handleViewUsers(null)}
              >
                Ver usuários
              </Button>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold">{usersByStatus.active || 0}</p>
              <p className="text-sm text-gray-500">Ativos</p>
              <Button 
                variant="link" 
                className="text-primary text-xs p-0 h-auto mt-2 hover:underline"
                onClick={() => handleViewUsers('active')}
              >
                Ver usuários
              </Button>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold">{usersByStatus.pending || 0}</p>
              <p className="text-sm text-gray-500">Pendentes</p>
              <Button 
                variant="link" 
                className="text-primary text-xs p-0 h-auto mt-2 hover:underline"
                onClick={() => handleViewUsers('pending')}
              >
                Ver usuários
              </Button>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold">{usersByStatus.inactive || 0}</p>
              <p className="text-sm text-gray-500">Inativos</p>
              <Button 
                variant="link" 
                className="text-primary text-xs p-0 h-auto mt-2 hover:underline"
                onClick={() => handleViewUsers('inactive')}
              >
                Ver usuários
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <UsersDialog 
        isOpen={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        users={statusFilter ? users.filter(user => user.status === statusFilter) : users}
        statusFilter={statusFilter}
        organizationName={organizationName}
      />
    </>
  );
};
