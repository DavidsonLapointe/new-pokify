
import { Building2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types";

interface OrganizationHeaderProps {
  user: User | null;
  getInitials: (name: string) => string;
}

export const OrganizationHeader = ({ user, getInitials }: OrganizationHeaderProps) => {
  if (!user) return null;

  return (
    <header className="h-16 bg-[#9b87f5] fixed top-0 left-0 right-0 z-40">
      <div className="h-full px-8 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-white">
          {user.organization?.logo ? (
            <img 
              src={user.organization.logo} 
              alt={user.organization.name} 
              className="h-8 w-auto"
            />
          ) : (
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-white" />
              <span className="font-medium">Seu Logo</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium text-white">{user.name}</p>
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-white text-[#9b87f5]">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};
