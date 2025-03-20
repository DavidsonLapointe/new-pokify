
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
import { CheckCircle2, Circle, HelpCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  // Helper function to render a permission item
  const renderPermissionItem = (permission: PermissionItem) => {
    const isActive = !!tempPermissions[permission.id];
    const isProfilePermission = permission.id === 'profile';
    const hasChildren = permission.children && permission.children.length > 0;
    
    return (
      <div key={permission.id} className="mb-3">
        <div className="flex items-center gap-2">
          <div 
            className={`cursor-pointer ${isProfilePermission ? 'opacity-70' : ''}`}
            onClick={() => !isProfilePermission && handlePermissionChange(permission.id)}
          >
            {isActive ? (
              <CheckCircle2 className="h-5 w-5 text-primary fill-primary" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          
          <span className="font-medium">{permission.label}</span>
          
          {permission.description && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" align="start" className="max-w-xs">
                  {permission.description}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Render children if parent is active */}
        {hasChildren && isActive && (
          <div className="ml-8 space-y-2 mt-2">
            {permission.children?.map((child) => (
              <div key={child.id} className="flex items-center gap-2">
                <div
                  className="cursor-pointer"
                  onClick={() => handlePermissionChange(child.id)}
                >
                  {tempPermissions[child.id] ? (
                    <CheckCircle2 className="h-5 w-5 text-primary fill-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <span>{child.label}</span>
                
                {child.description && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="right" align="start" className="max-w-xs">
                        {child.description}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
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
          <div className="space-y-1 py-4">
            {permissionsTree.map(renderPermissionItem)}
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
