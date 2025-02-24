import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomSwitch } from "@/components/ui/custom-switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserRole } from "@/types/user-types";
import { Lock, List, CreditCard, Building2 } from "lucide-react";
import { ADMIN_DEFAULT_PERMISSIONS, availableAdminRoutePermissions } from "@/types/admin-permissions";
import { RoleSelector } from "./RoleSelector";
import { SettingsTabs } from "./SettingsTabs";
import { DashboardTabs } from "./DashboardTabs";
import { organizationRoutes } from "./constants";

type PermissionConfig = {
  [key: string]: boolean;
};

type RolePermissions = {
  [K in UserRole]: PermissionConfig;
};

const initialPermissions: RolePermissions = {
  leadly_employee: {
    ...ADMIN_DEFAULT_PERMISSIONS.leadly_employee,
    "settings.alerts": true,
    "settings.analysis": true,
    "settings.retention": true,
    "settings.llm": true,
    "settings.system": true,
    "settings.permissions": true
  },
  admin: {
    profile: true,
    dashboard: true,
    "dashboard.leads": true,
    "dashboard.uploads": true,
    "dashboard.performance": true,
    "dashboard.objections": true,
    "dashboard.suggestions": true,
    "dashboard.sellers": true,
    leads: true,
    users: true,
    integrations: true,
    settings: true,
    plan: true,
    company: true
  },
  seller: {
    profile: true,
    dashboard: true,
    "dashboard.leads": true,
    leads: true
  }
};

const getRouteIcon = (route: string) => {
  if (route.includes('analysis-packages')) return <List className="h-4 w-4" />;
  if (route.includes('financial')) return <CreditCard className="h-4 w-4" />;
  if (route.includes('organizations')) return <Building2 className="h-4 w-4" />;
  
  const routeConfig = organizationRoutes.find(r => r.id === route);
  if (routeConfig) {
    const Icon = routeConfig.icon;
    return <Icon className="h-4 w-4" />;
  }
  
  return <List className="h-4 w-4" />;
};

export const DefaultPermissionsSettings = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>("leadly_employee");
  const [permissions, setPermissions] = useState<RolePermissions>(initialPermissions);

  const handleTogglePermission = (route: string) => {
    if (route === 'profile') return;

    setPermissions(prev => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [route]: !prev[selectedRole][route]
      }
    }));
  };

  const handleSave = () => {
    console.log("Saving permissions:", permissions);
    toast.success("Permissões padrão atualizadas com sucesso!");
  };

  const hasAccess = (route: string): boolean => {
    return !!permissions[selectedRole]?.[route];
  };

  const routesToShow = selectedRole === 'leadly_employee' 
    ? availableAdminRoutePermissions 
    : organizationRoutes;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissões Padrão por Função</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RoleSelector 
          selectedRole={selectedRole} 
          onRoleChange={(value) => setSelectedRole(value)} 
        />

        <div className="space-y-6">
          <div className="grid gap-4">
            {routesToShow.map(route => (
              <div key={typeof route === 'string' ? route : route.id} className="space-y-2">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    {getRouteIcon(typeof route === 'string' ? route : route.id)}
                    <span className="font-medium">
                      {typeof route === 'string' ? route : route.label}
                    </span>
                    {(typeof route === 'string' ? route : route.id) === 'profile' && (
                      <Lock className="h-4 w-4 text-gray-400 ml-2" />
                    )}
                  </div>
                  <CustomSwitch
                    checked={(typeof route === 'string' ? route : route.id) === 'profile' ? true : hasAccess(typeof route === 'string' ? route : route.id)}
                    onCheckedChange={() => handleTogglePermission(typeof route === 'string' ? route : route.id)}
                    disabled={(typeof route === 'string' ? route : route.id) === 'profile'}
                  />
                </div>
                
                {(typeof route === 'string' ? route : route.id) === 'dashboard' && 
                 (selectedRole === 'admin' || selectedRole === 'seller') && (
                  <DashboardTabs 
                    hasAccess={hasAccess}
                    onTogglePermission={handleTogglePermission}
                  />
                )}

                {(typeof route === 'string' ? route : route.id) === 'settings' && 
                 selectedRole === 'leadly_employee' && (
                  <SettingsTabs
                    hasAccess={hasAccess}
                    onTogglePermission={handleTogglePermission}
                  />
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
