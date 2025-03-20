
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@/types";
import { 
  permissionLabels, 
  dashboardTabPermissions, 
  settingsTabPermissions,
  crmTabPermissions,
  availablePermissions
} from "@/types/permissions";
import {
  User as UserIcon,
  FolderTree,
  Search,
  ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface PermissionsDistributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  organizationName?: string;
}

export const PermissionsDistributionModal = ({
  isOpen,
  onClose,
  users,
  organizationName,
}: PermissionsDistributionModalProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filter only active users
  const activeUsers = users.filter(user => user.status === 'active');

  // Organize permissions and users
  const getPermissionData = () => {
    const permissionMap: Record<string, { users: User[], label: string, count: number, hasChildPermissions?: boolean }> = {};
    
    // Initialize with all permissions from permissionLabels
    Object.entries(permissionLabels).forEach(([key, label]) => {
      const hasChildPermissions = 
        key === 'dashboard' || 
        key === 'settings' || 
        key === 'crm';
      
      permissionMap[key] = { 
        users: [], 
        label, 
        count: 0,
        hasChildPermissions 
      };
    });

    // Populate with actual active users
    activeUsers.forEach(user => {
      if (!user.permissions) return;

      Object.entries(user.permissions).forEach(([permKey, hasPermission]) => {
        if (hasPermission && permissionMap[permKey]) {
          permissionMap[permKey].users.push(user);
          permissionMap[permKey].count = permissionMap[permKey].users.length;
        }
      });
    });

    return permissionMap;
  };

  const permissionData = getPermissionData();

  // Get main categories (parent permissions without dots)
  const mainCategories = Object.keys(permissionData)
    .filter(key => !key.includes('.'))
    .sort((a, b) => permissionData[a].label.localeCompare(permissionData[b].label));

  // Helper function to determine if a module has tab permissions
  const hasTabPermissions = (moduleKey: string) => {
    if (moduleKey === 'dashboard') return true;
    if (moduleKey === 'settings') return true;
    if (moduleKey === 'crm') return true;
    return false;
  };

  // Get tab permissions for a given parent module
  const getTabPermissions = (parentKey: string) => {
    switch(parentKey) {
      case 'dashboard':
        return dashboardTabPermissions;
      case 'settings':
        return settingsTabPermissions;
      case 'crm':
        return crmTabPermissions;
      default:
        return [];
    }
  };

  // Filter permissions based on search
  const filteredPermissions = searchTerm 
    ? Object.entries(permissionData)
        .filter(([key, data]) => 
          data.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.users.some(user => 
            (user.name || user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
        .sort((a, b) => a[1].label.localeCompare(b[1].label))
    : [];

  const renderUserTooltip = (users: User[]) => {
    return (
      <div className="max-w-60">
        <p className="text-sm font-medium mb-1">Usuários com acesso:</p>
        {users.length > 0 ? (
          <ul className="space-y-1">
            {users.map((user, idx) => (
              <li key={idx} className="text-xs flex items-center gap-1.5">
                <UserIcon className="h-3 w-3" />
                <span>{user.name || user.email}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs">Nenhum usuário com acesso</p>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <FolderTree className="h-5 w-5 text-primary/80" />
            Distribuição de Permissões
          </DialogTitle>
          <DialogDescription>
            {organizationName || "Empresa"} - Visualização de permissões por função
          </DialogDescription>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por função ou usuário..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <ScrollArea className="flex-1 pr-2">
          {searchTerm ? (
            <div className="space-y-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Resultados da busca ({filteredPermissions.length})
              </h3>
              
              <div className="space-y-4">
                {filteredPermissions.map(([key, data]) => (
                  <div key={key} className="border rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-sm">
                        {data.label}
                        {key.includes('.') && <span className="text-xs text-muted-foreground ml-1">(aba)</span>}
                      </h4>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "cursor-help",
                                data.count > 0 
                                  ? "bg-primary/10 text-primary border-primary/20" 
                                  : "bg-gray-100 text-gray-500 border-gray-200"
                              )}
                            >
                              {data.count}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            {renderUserTooltip(data.users)}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredPermissions.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  Nenhum resultado encontrado para "{searchTerm}"
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {mainCategories.map(category => {
                const moduleHasTabs = hasTabPermissions(category);
                const tabKeys = getTabPermissions(category);
                
                return (
                  <div key={category} className="border rounded-lg overflow-hidden">
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
                              {renderUserTooltip(permissionData[category].users)}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    
                    {moduleHasTabs && (
                      <div className="px-2 py-2">
                        <ul className="space-y-2">
                          {tabKeys.map(tabKey => (
                            <li key={tabKey} className="flex justify-between items-center px-2 py-1 rounded hover:bg-gray-50">
                              <div className="flex items-center gap-1.5">
                                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{permissionData[tabKey]?.label}</span>
                              </div>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge 
                                      variant="outline" 
                                      className={cn(
                                        "cursor-help",
                                        permissionData[tabKey]?.count > 0 
                                          ? "bg-primary/10 text-primary border-primary/20" 
                                          : "bg-gray-100 text-gray-500 border-gray-200"
                                      )}
                                    >
                                      {permissionData[tabKey]?.count || 0}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {renderUserTooltip(permissionData[tabKey]?.users || [])}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
