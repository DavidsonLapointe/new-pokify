
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
import { permissionLabels, dashboardTabPermissions, settingsTabPermissions } from "@/types/permissions";
import {
  User as UserIcon,
  FolderTree,
  Search,
  Check,
  X,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

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
      const hasChildPermissions = key === 'dashboard' || key === 'settings';
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
    .filter(key => !key.includes('.') && key !== 'profile')
    .sort();

  // Group child permissions
  const getChildPermissions = (parentKey: string) => {
    return Object.entries(permissionData)
      .filter(([key]) => key.startsWith(`${parentKey}.`))
      .sort((a, b) => a[1].label.localeCompare(b[1].label));
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
        .sort((a, b) => b[1].count - a[1].count)
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
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

        <ScrollArea className="flex-1">
          {searchTerm ? (
            <div className="space-y-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Resultados da busca ({filteredPermissions.length})
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPermissions.map(([key, data]) => (
                  <PermissionCard 
                    key={key}
                    title={data.label}
                    users={data.users}
                    count={data.count}
                  />
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
              {mainCategories.map(category => (
                <div key={category} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">{permissionData[category].label}</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 cursor-help">
                            {permissionData[category].count}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-64">
                          <p className="text-sm font-medium mb-1">Usuários com acesso:</p>
                          {permissionData[category].users.length > 0 ? (
                            <ul className="space-y-1">
                              {permissionData[category].users.map((user, idx) => (
                                <li key={idx} className="text-xs flex items-center gap-1.5">
                                  <UserIcon className="h-3 w-3" />
                                  <span>{user.name || user.email}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs">Nenhum usuário com acesso</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Main permission card */}
                    <PermissionCard 
                      title={permissionData[category].label}
                      subtitle="Acesso principal"
                      users={permissionData[category].users}
                      count={permissionData[category].count}
                      isMainPermission
                      hasChildPermissions={permissionData[category].hasChildPermissions}
                    />

                    {/* Child permissions */}
                    {getChildPermissions(category).map(([childKey, childData]) => (
                      <PermissionCard 
                        key={childKey}
                        title={childData.label}
                        subtitle="Acesso específico"
                        users={childData.users}
                        count={childData.count}
                      />
                    ))}
                  </div>
                  
                  {category !== mainCategories[mainCategories.length - 1] && <Separator />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

interface PermissionCardProps {
  title: string;
  subtitle?: string;
  users: User[];
  count: number;
  isMainPermission?: boolean;
  hasChildPermissions?: boolean;
}

const PermissionCard = ({ 
  title, 
  subtitle, 
  users, 
  count, 
  isMainPermission = false,
  hasChildPermissions = false
}: PermissionCardProps) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className={`border rounded-lg overflow-hidden ${isMainPermission ? 'bg-secondary/10 border-secondary/30' : 'bg-white'}`}>
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium text-sm">
              {title}
              {hasChildPermissions && (
                <span className="ml-1 text-xs text-muted-foreground">(com abas)</span>
              )}
            </h4>
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className={`
                  ${isMainPermission 
                    ? 'bg-secondary/20 text-secondary border-secondary/30' 
                    : 'bg-primary/10 text-primary border-primary/20'} 
                  text-xs px-2 cursor-help`
                }>
                  {count}
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="max-w-64">
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
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="p-3">
        {users.length === 0 ? (
          <div className="text-xs text-center py-2 text-muted-foreground">
            Nenhum usuário com esta permissão
          </div>
        ) : (
          <div className="text-xs text-center py-2 text-muted-foreground">
            {count} usuário{count !== 1 ? 's' : ''} com acesso
          </div>
        )}
      </div>
    </div>
  );
};

