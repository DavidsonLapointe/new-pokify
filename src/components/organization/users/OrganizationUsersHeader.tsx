
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface OrganizationUsersHeaderProps {
  onAddUser: () => void;
}

export const OrganizationUsersHeader = ({ onAddUser }: OrganizationUsersHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <Button onClick={onAddUser}>
        <UserPlus className="w-4 h-4 mr-2" />
        Adicionar Usuário
      </Button>
    </div>
  );
};
