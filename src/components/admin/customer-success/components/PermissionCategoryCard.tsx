
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TabPermissionItem } from "./TabPermissionItem";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { PermissionManagementSheet } from "./PermissionManagementSheet";
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
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4 w-full">
      <div className="bg-gray-50 p-3 flex justify-between items-center">
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
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={cn(
                hasNoUsers 
                  ? "bg-red-100 text-red-500 border-red-200" 
                  : "bg-primary/10 text-primary border-primary/20"
              )}
            >
              {currentPermission.count}
            </Badge>

            <Sheet>
              <SheetTrigger asChild>
                <button 
                  className="text-primary hover:text-primary/80 transition-colors"
                  aria-label="Ver e gerenciar usuários com acesso a esta função"
                >
                  <Eye size={18} />
                </button>
              </SheetTrigger>
              <PermissionManagementSheet permissionKey={category} label={currentPermission.label} />
            </Sheet>
          </div>
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
