
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { PermissionWithUsers } from "../utils/permission-utils";
import { PermissionManagementSheet } from "./PermissionManagementSheet";

interface TabPermissionItemProps {
  tabKey: string;
  permissionData: PermissionWithUsers | undefined;
}

export const TabPermissionItem = ({ tabKey, permissionData }: TabPermissionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const users = permissionData?.users || [];
  const count = permissionData?.count || 0;
  const label = permissionData?.label || "";
  const hasNoUsers = count === 0;

  return (
    <li className="flex justify-between items-center px-2 py-1 rounded hover:bg-gray-50">
      <div className="flex items-center gap-1.5">
        <span className={cn("text-sm", hasNoUsers && "text-red-500 font-medium")}>{label}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Badge 
          variant="outline" 
          className={cn(
            hasNoUsers 
              ? "bg-red-100 text-red-500 border-red-200" 
              : "bg-primary/10 text-primary border-primary/20"
          )}
        >
          {count}
        </Badge>

        <button 
          className="text-primary hover:text-primary/80 transition-colors"
          aria-label="Ver e gerenciar usuários com acesso a esta função"
          onClick={() => setIsOpen(true)}
        >
          <Eye size={18} />
        </button>
        
        <PermissionManagementSheet 
          permissionKey={tabKey} 
          label={label} 
          open={isOpen}
          onOpenChange={setIsOpen}
        />
      </div>
    </li>
  );
};
