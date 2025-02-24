
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomSwitch } from "@/components/ui/custom-switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserRole } from "@/types/user-types";
import { Lock } from "lucide-react";
import { ADMIN_DEFAULT_PERMISSIONS, availableAdminRoutePermissions } from "@/types/admin-permissions";
import { RolePermissions } from "./types";
import { organizationRoutes } from "./constants";
import { getRouteIcon } from "./utils";
import { RoleSelector } from "./RoleSelector";
import { DashboardTabs } from "./DashboardTabs";

const initialPermissions: RolePermissions = {
  leadly_employee: ADMIN_DEFAULT_PERMISSIONS.leadly_employee,
  admin: {
    profile: ["view", "edit"],
    dashboard: ["view"],
    "dashboard-leads": ["view"],
    "dashboard-uploads": ["view"],
    "dashboard-performance": ["view"],
    "dashboard-objections": ["view"],
    "dashboard-suggestions": ["view"],
    "dashboard-sellers": ["view"],
    leads: ["view", "edit"],
    users: ["view", "edit"],
    integrations: ["view", "edit"],
    settings: ["view", "edit"],
    plan: ["view", "edit"],
    company: ["view", "edit"]
  },
  seller: {
    profile: ["view", "edit"],
    dashboard: ["view"],
    "dashboard-leads": ["view"],
    leads: ["view", "edit"]
  }
};

export const DefaultPermissionsSettings = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>("leadly_employee");
  const [permissions, setPermissions] = useState<RolePermissions>(initialPermissions);

  const handleTogglePermission = (route: string) => {
    if (route === 'profile') return;

    setPermissions(prev => {
      const currentPerms = { ...prev[selectedRole] };
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
    console.log("Saving permissions:", permissions);
    toast.success("Permissões padrão atualizadas com sucesso!");
  };

  const hasAccess = (route: string): boolean => {
    return Object.keys(permissions[selectedRole]?.[route] || {}).length > 0;
  };

  const getRoutesToDisplay = () => {
    if (selectedRole === 'leadly_employee') {
      return availableAdminRoutePermissions;
    }
    return organizationRoutes;
  };

  const routesToShow = getRoutesToDisplay();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissões Padrão por Função</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RoleSelector 
          selectedRole={selectedRole} 
          onRoleChange={(role) => setSelectedRole(role)} 
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
