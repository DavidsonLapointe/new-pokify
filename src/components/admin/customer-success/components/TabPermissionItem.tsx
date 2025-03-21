
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { UserTooltip } from "./UserTooltip";
import { PermissionWithUsers } from "../utils/permission-utils";

interface TabPermissionItemProps {
  tabKey: string;
  permissionData: PermissionWithUsers | undefined;
}

export const TabPermissionItem = ({ tabKey, permissionData }: TabPermissionItemProps) => {
  const users = permissionData?.users || [];
  const count = permissionData?.count || 0;
  const label = permissionData?.label || "";
  const hasNoUsers = count === 0;

  return (
    <li className="flex justify-between items-center px-2 py-1 rounded hover:bg-gray-50">
      <div className="flex items-center gap-1.5">
        <ChevronRight className="h-3 w-3 text-muted-foreground" />
        <span className={cn("text-sm", hasNoUsers && "text-red-500 font-medium")}>{label}</span>
      </div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="outline" 
              className={cn(
                "cursor-help",
                hasNoUsers 
                  ? "bg-red-100 text-red-500 border-red-200" 
                  : "bg-primary/10 text-primary border-primary/20"
              )}
            >
              {count}
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="left" align="center" alignOffset={-30} className="z-50">
            <UserTooltip users={users} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </li>
  );
};
