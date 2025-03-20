
import { User } from "@/types";
import { UserIcon } from "lucide-react";

interface UserTooltipProps {
  users: User[];
}

export const UserTooltip = ({ users }: UserTooltipProps) => {
  return (
    <div className="max-w-60">
      <p className="text-sm font-medium mb-1">Usuários com acesso:</p>
      {users.length > 0 ? (
        <ul className="space-y-1">
          {users.map((user, idx) => (
            <li key={idx} className="text-xs flex items-center gap-1.5">
              <UserIcon className="h-3 w-3" />
              <span className="truncate">{user.name || user.email}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs">Nenhum usuário com acesso</p>
      )}
    </div>
  );
};
