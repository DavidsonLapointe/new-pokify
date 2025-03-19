
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@/types";
import { permissionLabels } from "@/types/permissions";

interface UsersByPermissionProps {
  users: User[];
  organizationName?: string;
}

export const UsersByPermission = ({ users, organizationName }: UsersByPermissionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    // Group dashboard permissions together
    const group = key.startsWith('dashboard.') ? 'dashboard_tabs' : 'main_modules';
    
    if (!acc[group]) {
      acc[group] = {};
    }
    
    acc[group][key] = data;
    return acc;
  }, {} as Record<string, Record<string, { count: number, users: User[] }>>);

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle>Usuários por Função</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-2 bg-gray-50 rounded-lg flex flex-col items-center justify-center">
            <p className="mb-2">
              Visualize como estão distribuídas as permissões de acesso entre os usuários
            </p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              variant="cancel"
              size="sm"
              className="mt-1 flex items-center gap-2"
            >
              Clique aqui para verificar as permissões
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Distribuição de Permissões - {organizationName || "Empresa selecionada"}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              {/* Main Modules Section */}
              <div>
                <h3 className="text-lg font-medium mb-3">Módulos Principais</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(groupedPermissions.main_modules || {}).map(([key, data]) => (
                    <TooltipProvider key={key}>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{permissionLabels[key]}</span>
                              <Badge variant="outline">{data.count}</Badge>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="w-60 p-2">
                          <p className="font-semibold mb-1">Usuários com acesso:</p>
                          {data.users.map(user => (
                            <div key={user.id} className="text-sm py-1 border-b last:border-0">
                              {user.name} 
                              <span className="text-xs ml-1 text-gray-500">
                                ({user.status === 'active' ? 'ativo' : 'inativo'})
                              </span>
                            </div>
                          ))}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>

              {/* Dashboard Tabs Section */}
              {groupedPermissions.dashboard_tabs && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Abas do Dashboard</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(groupedPermissions.dashboard_tabs || {}).map(([key, data]) => (
                      <TooltipProvider key={key}>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger asChild>
                            <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{permissionLabels[key]}</span>
                                <Badge variant="outline">{data.count}</Badge>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="w-60 p-2">
                            <p className="font-semibold mb-1">Usuários com acesso:</p>
                            {data.users.map(user => (
                              <div key={user.id} className="text-sm py-1 border-b last:border-0">
                                {user.name} 
                                <span className="text-xs ml-1 text-gray-500">
                                  ({user.status === 'active' ? 'ativo' : 'inativo'})
                                </span>
                              </div>
                            ))}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
              )}

              {/* No permissions message */}
              {(!groupedPermissions.main_modules && !groupedPermissions.dashboard_tabs) && (
                <div className="text-center p-6">
                  <p className="text-gray-500">Nenhuma permissão configurada para os usuários</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
