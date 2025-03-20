
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User } from "@/types";
import { permissionLabels } from "@/types/permissions";
import {
  User as UserIcon,
  Layers,
  Layout,
  Settings,
  ChevronRight,
  FolderTree,
} from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<string>("all");

  // Organize users by permissions
  const getUsersByPermission = () => {
    const permissionMapping: Record<string, User[]> = {};

    users.forEach((user) => {
      if (user.permissions) {
        Object.entries(user.permissions).forEach(([permKey, hasPermission]) => {
          if (hasPermission && permissionLabels[permKey]) {
            if (!permissionMapping[permKey]) {
              permissionMapping[permKey] = [];
            }
            permissionMapping[permKey].push(user);
          }
        });
      }
    });

    return permissionMapping;
  };

  const permissionMapping = getUsersByPermission();

  // Group permissions into categories
  const groupPermissions = () => {
    const groups: Record<string, { [key: string]: User[] }> = {
      dashboard: {},
      settings: {},
      main: {},
    };

    Object.entries(permissionMapping).forEach(([permKey, users]) => {
      if (permKey.startsWith("dashboard.")) {
        groups.dashboard[permKey] = users;
      } else if (permKey.startsWith("settings.")) {
        groups.settings[permKey] = users;
      } else if (permKey !== "profile") {
        // Skip profile since everyone has it
        groups.main[permKey] = users;
      }
    });

    return groups;
  };

  const permissionGroups = groupPermissions();

  // Count users with each permission type
  const countUsersPerPermission = (permissionGroup: { [key: string]: User[] }) => {
    const uniqueUsers = new Set<string>();
    
    Object.values(permissionGroup).forEach(users => {
      users.forEach(user => uniqueUsers.add(user.id));
    });
    
    return uniqueUsers.size;
  };

  // Get the main dashboard permission and its users
  const dashboardPermission = permissionMapping["dashboard"] || [];
  const settingsPermission = permissionMapping["settings"] || [];

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

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="mb-4 bg-secondary/50 justify-start">
            <TabsTrigger value="all" className="flex items-center gap-1">
              <Layers className="h-4 w-4" />
              Todas ({users.length})
            </TabsTrigger>
            <TabsTrigger value="modules" className="flex items-center gap-1">
              <Layout className="h-4 w-4" />
              Módulos Principais ({countUsersPerPermission(permissionGroups.main)})
            </TabsTrigger>
            <TabsTrigger value="dashboard_tabs" className="flex items-center gap-1">
              <Layers className="h-4 w-4" />
              Abas do Dashboard ({countUsersPerPermission(permissionGroups.dashboard)})
            </TabsTrigger>
            <TabsTrigger value="settings_tabs" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              Configurações ({countUsersPerPermission(permissionGroups.settings)})
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            <TabsContent value="all" className="mt-0 space-y-6">
              {/* Main Modules */}
              {Object.keys(permissionGroups.main).length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Layout className="h-5 w-5 text-primary/80" />
                    Módulos Principais
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(permissionGroups.main).map(([permKey, users]) => (
                      <PermissionCard 
                        key={permKey} 
                        title={permissionLabels[permKey]} 
                        users={users}
                        count={users.length}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Dashboard with nested tabs */}
              {dashboardPermission.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary/80" />
                    Dashboard e suas abas
                  </h3>
                  
                  <NestedPermissionCard 
                    mainPermKey="dashboard"
                    mainTitle="Dashboard"
                    users={dashboardPermission}
                    subPermissions={permissionGroups.dashboard}
                  />
                </div>
              )}

              {/* Settings with nested tabs */}
              {settingsPermission.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary/80" />
                    Configurações e suas abas
                  </h3>
                  
                  <NestedPermissionCard 
                    mainPermKey="settings"
                    mainTitle="Configurações"
                    users={settingsPermission}
                    subPermissions={permissionGroups.settings}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="modules" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(permissionGroups.main).map(([permKey, users]) => (
                  <PermissionCard 
                    key={permKey} 
                    title={permissionLabels[permKey]} 
                    users={users}
                    count={users.length}
                  />
                ))}
              </div>
              {Object.keys(permissionGroups.main).length === 0 && (
                <div className="text-center p-6 text-muted-foreground">
                  Nenhum usuário com permissões de módulos principais
                </div>
              )}
            </TabsContent>

            <TabsContent value="dashboard_tabs" className="mt-0">
              {dashboardPermission.length > 0 ? (
                <NestedPermissionCard 
                  mainPermKey="dashboard"
                  mainTitle="Dashboard"
                  users={dashboardPermission}
                  subPermissions={permissionGroups.dashboard}
                  expanded={true}
                />
              ) : (
                <div className="text-center p-6 text-muted-foreground">
                  Nenhum usuário com permissões de dashboard
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings_tabs" className="mt-0">
              {settingsPermission.length > 0 ? (
                <NestedPermissionCard 
                  mainPermKey="settings"
                  mainTitle="Configurações"
                  users={settingsPermission}
                  subPermissions={permissionGroups.settings}
                  expanded={true}
                />
              ) : (
                <div className="text-center p-6 text-muted-foreground">
                  Nenhum usuário com permissões de configurações
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

interface PermissionCardProps {
  title: string;
  users: User[];
  count: number;
}

const PermissionCard = ({ title, users, count }: PermissionCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 bg-secondary/30">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">{title}</h4>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {count}
            </Badge>
          </div>
        </div>
        
        <div className="p-4 space-y-2">
          {users.slice(0, 3).map(user => (
            <div key={user.id} className="flex items-center gap-2 text-sm">
              <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="truncate flex-1">{user.name || user.email}</span>
              <Badge variant={user.status === 'active' ? 'success' : 'outline'} className="text-xs h-5">
                {user.status === 'active' ? 'ativo' : 'inativo'}
              </Badge>
            </div>
          ))}
          
          {users.length > 3 && (
            <div className="text-xs text-primary font-medium pt-1">
              + {users.length - 3} outros usuários
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface NestedPermissionCardProps {
  mainPermKey: string;
  mainTitle: string;
  users: User[];
  subPermissions: { [key: string]: User[] };
  expanded?: boolean;
}

const NestedPermissionCard = ({ 
  mainPermKey, 
  mainTitle, 
  users, 
  subPermissions,
  expanded = false
}: NestedPermissionCardProps) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div 
          className="p-4 bg-secondary/30 cursor-pointer flex items-center justify-between"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{mainTitle}</h4>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {users.length}
            </Badge>
          </div>
          <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </div>
        
        <div className="p-4">
          <div className="space-y-2">
            {users.slice(0, 3).map(user => (
              <div key={user.id} className="flex items-center gap-2 text-sm">
                <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="truncate flex-1">{user.name || user.email}</span>
                <Badge variant={user.status === 'active' ? 'success' : 'outline'} className="text-xs h-5">
                  {user.status === 'active' ? 'ativo' : 'inativo'}
                </Badge>
              </div>
            ))}
            
            {users.length > 3 && (
              <div className="text-xs text-primary font-medium">
                + {users.length - 3} outros usuários
              </div>
            )}
          </div>
        </div>
        
        {isExpanded && Object.keys(subPermissions).length > 0 && (
          <>
            <Separator />
            <div className="p-4 pt-2">
              <h5 className="text-sm font-medium mb-3 text-muted-foreground">Abas Específicas:</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(subPermissions).map(([permKey, subUsers]) => (
                  <div key={permKey} className="bg-secondary/20 p-3 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{permissionLabels[permKey]}</span>
                      <Badge variant="outline" className="text-xs">{subUsers.length}</Badge>
                    </div>
                    
                    <div className="space-y-1.5">
                      {subUsers.slice(0, 2).map(user => (
                        <div key={user.id} className="flex items-center gap-1.5 text-xs">
                          <UserIcon className="h-3 w-3 text-muted-foreground" />
                          <span className="truncate flex-1">{user.name || user.email}</span>
                        </div>
                      ))}
                      
                      {subUsers.length > 2 && (
                        <div className="text-xs text-primary/80">
                          + {subUsers.length - 2} outros
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
