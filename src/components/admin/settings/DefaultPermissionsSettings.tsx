
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CustomSwitch } from "@/components/ui/custom-switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserRole } from "@/types/user-types";
import { Settings, User, Lock, List, BarChart3, Users, Network, CreditCard, Building2 } from "lucide-react";
import { ADMIN_DEFAULT_PERMISSIONS, availableAdminRoutePermissions } from "@/types/admin-permissions";

// Rotas do ambiente da organização
const organizationRoutes = [
  {
    id: "profile",
    label: "Meu Perfil",
    icon: User,
    isDefault: true
  },
  {
    id: "dashboard",
    label: "Dashboard",
    icon: BarChart3
  },
  {
    id: "leads",
    label: "Análise de Leads",
    icon: List
  },
  {
    id: "users",
    label: "Usuários",
    icon: Users
  },
  {
    id: "integrations",
    label: "Integrações",
    icon: Network
  },
  {
    id: "settings",
    label: "Configurações",
    icon: Settings
  },
  {
    id: "plan",
    label: "Meu Plano",
    icon: CreditCard
  },
  {
    id: "company",
    label: "Minha Empresa",
    icon: Building2
  }
];

type PermissionConfig = {
  [key: string]: string[];
};

type RolePermissions = {
  [K in UserRole]: PermissionConfig;
};

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

const getRouteIcon = (route: string) => {
  // Para rotas do ambiente administrativo
  if (route.includes('analysis-packages')) return <List className="h-4 w-4" />;
  if (route.includes('financial')) return <CreditCard className="h-4 w-4" />;
  if (route.includes('organizations')) return <Building2 className="h-4 w-4" />;
  
  // Para rotas da organização
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

  // Define as abas do dashboard disponíveis
  const dashboardTabs = [
    { id: "leads", label: "Leads" },
    { id: "uploads", label: "Uploads" },
    { id: "performance", label: "Performance Vendedores" },
    { id: "objections", label: "Objeções" },
    { id: "suggestions", label: "Sugestões" },
    { id: "sellers", label: "Vendedores" }
  ];

  // Decide quais rotas mostrar baseado no papel selecionado
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
                
                {/* Mostra as abas do dashboard apenas para admin e seller */}
                {(typeof route === 'string' ? route : route.id) === 'dashboard' && 
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
