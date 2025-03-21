
import { FolderTree } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { UserTooltip } from "./UserTooltip";
import { TabPermissionItem } from "./TabPermissionItem";
import { 
  PermissionMap, 
  getTabPermissions, 
  hasTabPermissions 
} from "../utils/permission-utils";

interface PermissionCategoryCardProps {
  category: string;
  permissionData: PermissionMap;
}

export const PermissionCategoryCard = ({ 
  category, 
  permissionData 
}: PermissionCategoryCardProps) => {
  const moduleHasTabs = hasTabPermissions(category);
  const tabKeys = getTabPermissions(category);
  const currentPermission = permissionData[category];
  const hasNoUsers = currentPermission.count === 0;
  
  return (
    <div className="border rounded-lg overflow-hidden mb-4 w-full">
      <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
        <h3 className={cn(
          "font-medium", 
          hasNoUsers && !moduleHasTabs && "text-red-500"
        )}>
          {currentPermission.label}
          {moduleHasTabs && (
            <span className="ml-1 text-xs text-muted-foreground">(com abas)</span>
          )}
        </h3>
        
        {!moduleHasTabs && (
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
                  {currentPermission.count}
                </Badge>
              </TooltipTrigger>
              <TooltipContent 
                side="left" 
                align="center" 
                alignOffset={-30} 
                className="z-50"
                sideOffset={5}
              >
                <UserTooltip users={currentPermission.users} />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      {moduleHasTabs && (
        <div className="px-2 py-2">
          <ul className="space-y-2">
            {tabKeys.map(tabKey => (
              <TabPermissionItem 
                key={tabKey} 
                tabKey={tabKey} 
                permissionData={permissionData[tabKey]} 
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
