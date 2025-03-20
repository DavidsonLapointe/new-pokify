
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
  
  return (
    <div className="border rounded-lg overflow-hidden mb-4 w-full">
      <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
        <h3 className="font-medium">
          {permissionData[category].label}
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
                    permissionData[category].count > 0 
                      ? "bg-primary/10 text-primary border-primary/20" 
                      : "bg-gray-100 text-gray-500 border-gray-200"
                  )}
                >
                  {permissionData[category].count}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <UserTooltip users={permissionData[category].users} />
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
