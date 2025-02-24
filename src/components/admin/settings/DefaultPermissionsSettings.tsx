
import { useState } from "react";
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

  const handleTogglePermission = (route: string) => {
    // Não permite alteração se for a rota de perfil
    if (route === 'profile') return;

    setPermissions(prev => {
      const currentPerms = { ...prev[selectedRole] };
      
      // Se já tem alguma permissão, removemos todas. Se não tem, adicionamos acesso completo
      const hasAnyPermission = Object.keys(currentPerms[route] || {}).length > 0;
      
      return {
        ...prev,
        [selectedRole]: {
          ...currentPerms,
          [route]: hasAnyPermission ? [] : ['view', 'edit', 'delete']
        }
      };
    });
  };

  const handleSave = () => {
    // TODO: Implement API call to save permissions
    console.log("Saving permissions:", permissions);
    toast.success("Permissões padrão atualizadas com sucesso!");
  };

  const hasAccess = (route: string): boolean => {
    return Object.keys(permissions[selectedRole]?.[route] || {}).length > 0;
  };

  // Obtém todas as rotas disponíveis do arquivo de configuração
  const availableRoutes = availableAdminRoutePermissions.map(route => route.id);

  // Define as abas do dashboard disponíveis
  const dashboardTabs = [
    { id: "leads", label: "Leads" },
    { id: "uploads", label: "Uploads" },
    { id: "performance", label: "Performance Vendedores" },
    { id: "objections", label: "Objeções" },
    { id: "suggestions", label: "Sugestões" },
    { id: "sellers", label: "Vendedores" }
  ];

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
              <div key={route} className="space-y-2">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    {getRouteIcon(route)}
                    <span className="font-medium">
                      {getRouteLabel(route)}
                    </span>
                    {route === 'profile' && (
                      <Lock className="h-4 w-4 text-gray-400 ml-2" />
                    )}
                  </div>
                  <CustomSwitch
                    checked={route === 'profile' ? true : hasAccess(route)}
                    onCheckedChange={() => handleTogglePermission(route)}
                    disabled={route === 'profile'}
                  />
                </div>
                
                {/* Mostra as abas do dashboard apenas para admin e seller */}
                {route === 'dashboard' && 
                 (selectedRole === 'admin' || selectedRole === 'seller') && (
                  <div className="ml-8 space-y-2">
                    <Label className="text-sm text-muted-foreground">Abas do Dashboard:</Label>
                    <div className="grid gap-2">
                      {dashboardTabs.map(tab => (
                        <div key={tab.id} className="flex items-center justify-between p-2 border rounded-lg">
                          <span className="text-sm">{tab.label}</span>
                          <CustomSwitch
                            checked={hasAccess(`dashboard-${tab.id}`)}
                            onCheckedChange={() => handleTogglePermission(`dashboard-${tab.id}`)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
