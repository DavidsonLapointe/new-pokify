
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { Users, FolderTree } from "lucide-react";
import { PermissionsDistributionModal } from "./PermissionsDistributionModal";

interface UsersByPermissionProps {
  users: User[];
  organizationName?: string;
}

export const UsersByPermission = ({ users, organizationName }: UsersByPermissionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Count active users
  const activeUsersCount = users.filter(user => user.status === 'active').length;

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary/80" />
            Usuários por Função
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="text-center p-4 bg-gray-50 rounded-lg flex flex-col items-center justify-center h-full">
            <p className="mb-4 text-gray-600">
              Visualize como estão distribuídas as permissões de acesso entre os {activeUsersCount} usuários ativos
            </p>
            <Button 
              onClick={() => setIsModalOpen(true)}
              variant="cancel"
              size="sm"
              className="mt-2 mx-auto flex items-center gap-2"
            >
              <FolderTree className="h-4 w-4" />
              Visualizar distribuição de permissões
            </Button>
          </div>
        </CardContent>
      </Card>

      <PermissionsDistributionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        users={users}
        organizationName={organizationName}
      />
    </>
  );
};
