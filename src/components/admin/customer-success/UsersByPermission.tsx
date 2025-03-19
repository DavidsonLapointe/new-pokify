
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { User } from "@/types";
import { permissionLabels } from "@/types/permissions";
import { User as UserIcon, Users, FolderTree, Layers } from "lucide-react";

interface UsersByPermissionProps {
  users: User[];
  organizationName?: string;
}

export const UsersByPermission = ({ users, organizationName }: UsersByPermissionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");

  // Collect permission counts across all users
  const permissionCounts = users.reduce((acc, user) => {
    if (user.permissions) {
      Object.entries(user.permissions).forEach(([permKey, hasPermission]) => {
        if (hasPermission && permissionLabels[permKey]) {
          if (!acc[permKey]) {
            acc[permKey] = {
              count: 0,
              users: []
            };
          }
          acc[permKey].count += 1;
          acc[permKey].users.push(user);
        }
      });
    }
    return acc;
  }, {} as Record<string, { count: number, users: User[] }>);

  // Group permissions by module
  const groupedPermissions = Object.entries(permissionCounts).reduce((acc, [key, data]) => {
    let group = 'main_modules';
    
    // Group dashboard permissions together
    if (key.startsWith('dashboard.')) {
      group = 'dashboard_tabs';
    }
    // Group settings permissions together
    else if (key.startsWith('settings.')) {
      group = 'settings_tabs';
    }
    
    if (!acc[group]) {
      acc[group] = {};
    }
    
    acc[group][key] = data;
    return acc;
  }, {} as Record<string, Record<string, { count: number, users: User[] }>>);

  // Get the total users count with each type of permission
  const getModuleUserCounts = () => {
    const counts = {
      main_modules: new Set<string>(),
      dashboard_tabs: new Set<string>(),
      settings_tabs: new Set<string>()
    };

    Object.entries(groupedPermissions).forEach(([groupKey, permissions]) => {
      Object.entries(permissions).forEach(([, data]) => {
        data.users.forEach(user => {
          counts[groupKey as keyof typeof counts].add(user.id);
        });
      });
    });

    return {
      main_modules: counts.main_modules.size,
      dashboard_tabs: counts.dashboard_tabs.size,
      settings_tabs: counts.settings_tabs.size
    };
  };

  const userCounts = getModuleUserCounts();

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary/80" />
            Usuários por Função
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="text-center p-4 bg-gray-50 rounded-lg flex flex-col items-center justify-center h-full">
            <p className="mb-4 text-gray-600">
              Visualize como estão distribuídas as permissões de acesso entre os usuários
            </p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              variant="cancel"
              size="sm"
              className="mt-2 mx-auto flex items-center gap-2"
            >
              <Layers className="h-4 w-4" />
              Clique aqui para verificar as permissões
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FolderTree className="h-5 w-5 text-primary/80" />
              Distribuição de Permissões
            </DialogTitle>
            <DialogDescription>
              {organizationName || "Empresa selecionada"} - Detalhamento de permissões por usuário
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-2">
            <TabsList className="w-full justify-start mb-4 bg-gray-100">
              <TabsTrigger value="all" className="flex items-center gap-1">
                <Layers className="h-4 w-4" />
                Todas ({userCounts.main_modules + userCounts.dashboard_tabs + userCounts.settings_tabs})
              </TabsTrigger>
              <TabsTrigger value="main_modules" className="flex items-center gap-1">
                <FolderTree className="h-4 w-4" />
                Módulos Principais ({userCounts.main_modules})
              </TabsTrigger>
              <TabsTrigger value="dashboard_tabs" className="flex items-center gap-1">
                <Layers className="h-4 w-4" />
                Abas do Dashboard ({userCounts.dashboard_tabs})
              </TabsTrigger>
              <TabsTrigger value="settings_tabs" className="flex items-center gap-1">
                <Layers className="h-4 w-4" />
                Abas de Configurações ({userCounts.settings_tabs})
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1 max-h-[60vh]">
              <TabsContent value="all" className="p-1 space-y-6">
                {/* Main Modules Section */}
                {Object.keys(groupedPermissions.main_modules || {}).length > 0 && (
                  <div>
                    <div className="flex items-center mb-4">
                      <FolderTree className="h-5 w-5 text-primary/80 mr-2" />
                      <h3 className="text-lg font-medium">Módulos Principais</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(groupedPermissions.main_modules || {}).map(([key, data]) => (
                        <PermissionCard key={key} permKey={key} data={data} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Dashboard Tabs Section */}
                {Object.keys(groupedPermissions.dashboard_tabs || {}).length > 0 && (
                  <div className="mt-8">
                    <div className="flex items-center mb-4">
                      <Layers className="h-5 w-5 text-primary/80 mr-2" />
                      <h3 className="text-lg font-medium">Abas do Dashboard</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(groupedPermissions.dashboard_tabs || {}).map(([key, data]) => (
                        <PermissionCard key={key} permKey={key} data={data} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Settings Tabs Section */}
                {Object.keys(groupedPermissions.settings_tabs || {}).length > 0 && (
                  <div className="mt-8">
                    <div className="flex items-center mb-4">
                      <Layers className="h-5 w-5 text-primary/80 mr-2" />
                      <h3 className="text-lg font-medium">Abas de Configurações</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(groupedPermissions.settings_tabs || {}).map(([key, data]) => (
                        <PermissionCard key={key} permKey={key} data={data} />
                      ))}
                    </div>
                  </div>
                )}

                {/* No permissions message */}
                {(!groupedPermissions.main_modules && !groupedPermissions.dashboard_tabs && !groupedPermissions.settings_tabs) && (
                  <div className="text-center p-6">
                    <p className="text-gray-500">Nenhuma permissão configurada para os usuários</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="main_modules" className="p-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(groupedPermissions.main_modules || {}).map(([key, data]) => (
                    <PermissionCard key={key} permKey={key} data={data} />
                  ))}
                </div>
                {(!groupedPermissions.main_modules || Object.keys(groupedPermissions.main_modules).length === 0) && (
                  <div className="text-center p-6">
                    <p className="text-gray-500">Nenhum usuário com permissões de módulos principais</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="dashboard_tabs" className="p-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(groupedPermissions.dashboard_tabs || {}).map(([key, data]) => (
                    <PermissionCard key={key} permKey={key} data={data} />
                  ))}
                </div>
                {(!groupedPermissions.dashboard_tabs || Object.keys(groupedPermissions.dashboard_tabs).length === 0) && (
                  <div className="text-center p-6">
                    <p className="text-gray-500">Nenhum usuário com permissões de abas do dashboard</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="settings_tabs" className="p-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(groupedPermissions.settings_tabs || {}).map(([key, data]) => (
                    <PermissionCard key={key} permKey={key} data={data} />
                  ))}
                </div>
                {(!groupedPermissions.settings_tabs || Object.keys(groupedPermissions.settings_tabs).length === 0) && (
                  <div className="text-center p-6">
                    <p className="text-gray-500">Nenhum usuário com permissões de abas de configurações</p>
                  </div>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Permission Card Component
interface PermissionCardProps {
  permKey: string;
  data: { count: number; users: User[] };
}

const PermissionCard = ({ permKey, data }: PermissionCardProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className="bg-white p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-medium">{permissionLabels[permKey]}</span>
                <Badge 
                  variant="outline" 
                  className="bg-[#EEE8FB] text-primary border-primary/20"
                >
                  {data.count}
                </Badge>
              </div>
            </div>
            
            {/* Show a preview of first 2 users */}
            <div className="mt-2">
              {data.users.slice(0, 2).map(user => (
                <div key={user.id} className="flex items-center gap-2 text-sm text-gray-600 mt-1.5">
                  <UserIcon className="h-3.5 w-3.5" />
                  <span className="truncate">{user.name}</span>
                  <span className="text-xs ml-1 text-gray-500">
                    ({user.status === 'active' ? 'ativo' : 'inativo'})
                  </span>
                </div>
              ))}
              
              {data.users.length > 2 && (
                <div className="text-xs text-primary mt-1.5 font-medium">
                  + {data.users.length - 2} outros usuários
                </div>
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="w-72 p-3 bg-white shadow-lg rounded-lg border border-gray-200">
          <p className="font-semibold mb-2 flex items-center gap-1">
            <Users className="h-4 w-4" />
            Usuários com acesso:
          </p>
          <Separator className="mb-2" />
          <ScrollArea className="max-h-[200px]">
            {data.users.map(user => (
              <div key={user.id} className="flex items-center gap-2 py-1.5 border-b last:border-0">
                <UserIcon className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    {user.email}
                    <span className="inline-flex items-center">
                      •
                      <Badge 
                        variant={user.status === 'active' ? 'success' : 'secondary'} 
                        className="ml-1 text-xs px-1.5 py-0"
                      >
                        {user.status === 'active' ? 'ativo' : 'inativo'}
                      </Badge>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
          <Separator className="mt-2 mb-2" />
          <div className="text-xs text-gray-500 italic">
            Dica: Gerencie permissões na página de Usuários
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
