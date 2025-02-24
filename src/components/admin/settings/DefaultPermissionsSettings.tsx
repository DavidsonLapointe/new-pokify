
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CustomSwitch } from "@/components/ui/custom-switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ADMIN_DEFAULT_PERMISSIONS, availableAdminRoutePermissions } from "@/types/admin-permissions";
import { UserRole } from "@/types/user-types";
import { Settings, User, Lock, List } from "lucide-react";

type PermissionConfig = {
  [key: string]: string[];
};

type RolePermissions = {
  [K in UserRole]: PermissionConfig;
};

const getRouteLabel = (routeId: string): string => {
  const route = availableAdminRoutePermissions.find(r => r.id === routeId);
  return route?.label || routeId;
};

const getRouteIcon = (routeId: string) => {
  switch (routeId) {
    case 'settings':
      return <Settings className="h-4 w-4" />;
    case 'profile':
      return <User className="h-4 w-4" />;
    default:
      return <List className="h-4 w-4" />;
  }
};

export const DefaultPermissionsSettings = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>("leadly_employee");
  const [permissions, setPermissions] = useState<RolePermissions>(ADMIN_DEFAULT_PERMISSIONS);

  const handleTogglePermission = (route: string, permission: string) => {
    // Não permite alteração se for a rota de perfil
    if (route === 'profile') return;

    setPermissions(prev => {
      const currentPerms = { ...prev[selectedRole] };
      const routePerms = [...(currentPerms[route] || [])];
      
      const updatedRoutePerms = routePerms.includes(permission)
        ? routePerms.filter(p => p !== permission)
        : [...routePerms, permission];

      return {
        ...prev,
        [selectedRole]: {
          ...currentPerms,
          [route]: updatedRoutePerms
        }
      };
    });
  };

  const handleSave = () => {
    // TODO: Implement API call to save permissions
    console.log("Saving permissions:", permissions);
    toast.success("Permissões padrão atualizadas com sucesso!");
  };

  const hasPermission = (route: string, permission: string): boolean => {
    return permissions[selectedRole]?.[route]?.includes(permission) || false;
  };

  // Obtém todas as rotas disponíveis do arquivo de configuração
  const availableRoutes = availableAdminRoutePermissions.map(route => route.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissões Padrão por Função</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Selecione a Função</Label>
          <RadioGroup
            value={selectedRole}
            onValueChange={(value: UserRole) => setSelectedRole(value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="leadly_employee" id="leadly_employee" />
              <Label htmlFor="leadly_employee">Funcionário Leadly</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="admin" id="admin" />
              <Label htmlFor="admin">Administrador</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="seller" id="seller" />
              <Label htmlFor="seller">Vendedor</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4">
            {availableRoutes.map(route => (
              <div key={route} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  {getRouteIcon(route)}
                  <span className="font-medium">
                    {getRouteLabel(route)}
                  </span>
                  {route === 'profile' && (
                    <Lock className="h-4 w-4 text-gray-400 ml-2" />
                  )}
                </div>
                <div className="flex items-center gap-4">
                  {(permissions[selectedRole]?.[route] || []).map(permission => (
                    <div key={`${route}-${permission}`} className="flex items-center gap-2">
                      <Label htmlFor={`${route}-${permission}`} className="text-sm">
                        {permission}
                      </Label>
                      <CustomSwitch
                        id={`${route}-${permission}`}
                        checked={route === 'profile' ? true : hasPermission(route, permission)}
                        onCheckedChange={() => handleTogglePermission(route, permission)}
                        disabled={route === 'profile'}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Salvar Configurações
        </Button>
      </CardContent>
    </Card>
  );
};
