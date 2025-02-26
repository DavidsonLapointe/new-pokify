
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface OrganizationUsersHeaderProps {
  onAddUser: () => void;
}

export const OrganizationUsersHeader = ({ onAddUser }: OrganizationUsersHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Usuários</h1>
        <p className="text-muted-foreground">
          Gerencie os usuários da sua organização
        </p>
      </div>
      <Button onClick={onAddUser}>
        <UserPlus className="w-4 h-4 mr-2" />
        Novo Usuário
      </Button>
    </div>
  );
};
