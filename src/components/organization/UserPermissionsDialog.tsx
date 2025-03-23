
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { Info } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

interface UserPermissionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUserUpdate: (user: User) => void;
}

// Define permission structure with children
interface PermissionItem {
  id: string;
  label: string;
  description?: string;
  children?: PermissionItem[];
}

// Define the permissions tree structure
const permissionsTree: PermissionItem[] = [
  {
    id: "profile",
    label: "Meu Perfil",
    description: "Acesso ao próprio perfil e configurações"
  },
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Acesso ao painel principal",
    children: [
      { id: "dashboard.analytics", label: "Analytics", description: "Visualização de métricas e analíticos" },
      { id: "dashboard.organizations", label: "Empresas", description: "Visualização de empresas" },
      { id: "dashboard.financial", label: "Financeiro", description: "Visualização de dados financeiros" }
    ]
  },
  {
    id: "organizations",
    label: "Empresas",
    description: "Gerenciamento de empresas",
    children: [
      { id: "organizations.manage", label: "Gerenciar", description: "Criar e editar empresas" },
      { id: "organizations.support", label: "Suporte", description: "Oferecer suporte às empresas" }
    ]
  },
  {
    id: "users",
    label: "Usuários",
    description: "Gerenciamento de usuários"
  },
  {
    id: "modules",
    label: "Módulos",
    description: "Gerenciamento de módulos",
    children: [
      { id: "modules.manage", label: "Gerenciar", description: "Criar e editar módulos" },
      { id: "modules.setups", label: "Setups", description: "Configurar setups de módulos" }
    ]
  },
  {
    id: "plans",
    label: "Planos",
    description: "Gerenciamento de planos e assinaturas"
  },
  {
    id: "credit-packages",
    label: "Pacotes de Créditos",
    description: "Gerenciamento de pacotes de créditos",
    children: [
      { id: "credit-packages.manage", label: "Gerenciar", description: "Criar e editar pacotes" },
      { id: "credit-packages.sales", label: "Vendas", description: "Visualizar histórico de vendas" }
    ]
  },
  {
    id: "financial",
    label: "Financeiro",
    description: "Gerenciamento financeiro",
    children: [
      { id: "financial.invoices", label: "Faturas", description: "Gerenciamento de faturas" },
      { id: "financial.reports", label: "Relatórios", description: "Relatórios financeiros" }
    ]
  },
  {
    id: "integrations",
    label: "Integrações",
    description: "Gerenciamento de integrações com sistemas externos"
  },
  {
    id: "settings",
    label: "Configurações",
    description: "Configurações gerais do sistema"
  }
];

export const UserPermissionsDialog = ({
  isOpen,
  onClose,
  user,
  onUserUpdate,
}: UserPermissionsDialogProps) => {
  if (!user) return null;

  const {
    saving,
    tempPermissions,
    handlePermissionChange,
    handleSave,
    handleClose,
  } = useUserPermissions(user, isOpen, onClose, onUserUpdate);

  // Verifica se uma permissão está ativa
  const isPermissionActive = (permissionId: string): boolean => {
    return !!tempPermissions[permissionId];
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Permissões do Usuário - {user.name || user.email}</DialogTitle>
          <DialogDescription>
            Gerencie as permissões de acesso deste usuário.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 h-[420px]">
          <div className="space-y-6 py-4">
            {permissionsTree.map((route) => (
              <div key={route.id} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`section-${route.id}`}
                    checked={isPermissionActive(route.id)}
                    onCheckedChange={() => handlePermissionChange(route.id)}
                    disabled={route.id === 'profile'}
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <label
                    htmlFor={`section-${route.id}`}
                    className="font-medium flex items-center gap-2"
                  >
                    {route.label}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent side="right" align="start" className="max-w-xs">
                          {route.description || `Acesso à seção ${route.label}`}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                </div>

                {/* Renderiza as abas quando aplicável e a permissão principal está ativa */}
                {route.children && isPermissionActive(route.id) && (
                  <div className="ml-6 border-l-2 border-primary/20 pl-4 space-y-2">
                    {route.children.map(tab => (
                      <div key={tab.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tab-${tab.id}`}
                          checked={isPermissionActive(tab.id)}
                          onCheckedChange={() => handlePermissionChange(tab.id)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                        <label
                          htmlFor={`tab-${tab.id}`}
                          className="text-sm flex items-center gap-2"
                        >
                          {tab.label}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3.5 w-3.5 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent side="right" align="start" className="max-w-xs">
                                {tab.description}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="pt-4">
          <Button variant="cancel" onClick={handleClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
