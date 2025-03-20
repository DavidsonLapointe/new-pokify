
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "@/types";
import { useEffect, useState } from "react";
import { availableAdminRoutePermissions } from "@/types/admin-permissions";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AdminUserPermissionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUserUpdate: (user: User) => void;
}

// Mapeamento de rotas para suas abas
const routeWithTabs = {
  dashboard: [
    { id: "dashboard.analytics", label: "Analytics", description: "Visualização de métricas gerais e KPIs" },
    { id: "dashboard.organizations", label: "Empresas", description: "Resumo das organizações ativas e inativas" },
    { id: "dashboard.financial", label: "Financeiro", description: "Visão geral financeira e faturamento" }
  ],
  settings: [
    { id: "settings.alerts", label: "Alertas", description: "Configuração de notificações e limites de alerta" },
    { id: "settings.analysis", label: "Análise", description: "Configurações para análise de leads" },
    { id: "settings.retention", label: "Retenção", description: "Políticas de retenção de dados" },
    { id: "settings.llm", label: "LLM", description: "Configurações de modelos de linguagem" },
    { id: "settings.system", label: "Sistema", description: "Configurações gerais do sistema" },
    { id: "settings.permissions", label: "Permissões", description: "Gerenciamento de permissões padrão" }
  ],
  "credit-packages": [
    { id: "credit-packages.manage", label: "Gerenciar", description: "Criar e editar pacotes de créditos" },
    { id: "credit-packages.sales", label: "Vendas", description: "Visualizar histórico de vendas de pacotes" }
  ],
  financial: [
    { id: "financial.invoices", label: "Faturas", description: "Gerenciamento de faturas e cobranças" },
    { id: "financial.reports", label: "Relatórios", description: "Relatórios financeiros e métricas" }
  ],
  organizations: [
    { id: "organizations.manage", label: "Gerenciar", description: "Cadastro e gerenciamento de empresas" },
    { id: "organizations.support", label: "Suporte", description: "Ferramentas de suporte para organizações" }
  ],
  modules: [
    { id: "modules.manage", label: "Gerenciar", description: "Cadastro e configuração de módulos" },
    { id: "modules.setups", label: "Setups", description: "Gerenciamento de setups de módulos" }
  ]
};

export const AdminUserPermissionsDialog = ({
  isOpen,
  onClose,
  user,
  onUserUpdate,
}: AdminUserPermissionsDialogProps) => {
  const { user: currentUser } = useUser();
  const [selectedPermissions, setSelectedPermissions] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (isOpen) {
      setSelectedPermissions(user.permissions || {});
    }
  }, [isOpen, user]);

  const handlePermissionChange = (routeId: string) => {
    if (routeId === 'profile') return;

    setSelectedPermissions(prev => {
      const newPermissions = { ...prev };
      
      // Altera o valor da permissão selecionada
      newPermissions[routeId] = !prev[routeId];
      
      // Se for uma rota principal que foi desativada, desativa também todas as suas abas
      if (!newPermissions[routeId] && routeWithTabs[routeId]) {
        routeWithTabs[routeId].forEach(tab => {
          newPermissions[tab.id] = false;
        });
      }
      
      // Se for uma aba que foi ativada, certifique-se de que a rota principal também está ativa
      if (newPermissions[routeId] && routeId.includes('.')) {
        const mainRoute = routeId.split('.')[0];
        newPermissions[mainRoute] = true;
      }

      return newPermissions;
    });
  };

  const handleSave = () => {
    try {
      // Ensure 'profile' permission is always present
      const updatedPermissions = {
        ...selectedPermissions,
        profile: true
      };

      const updatedUser = {
        ...user,
        permissions: updatedPermissions
      };

      onUserUpdate(updatedUser);
      toast.success("Permissões atualizadas com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao salvar permissões:", error);
      toast.error("Erro ao atualizar permissões");
    }
  };

  // Verifica se uma permissão está ativa
  const isPermissionActive = (routeId: string): boolean => {
    return !!selectedPermissions[routeId];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Permissões do Usuário - {user.name}</DialogTitle>
          <DialogDescription>
            Gerencie as permissões de acesso deste usuário.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 py-4">
            {availableAdminRoutePermissions.map((route) => (
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
                        <TooltipContent className="max-w-xs">
                          {route.description || `Acesso à seção ${route.label}`}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                </div>

                {/* Renderiza as abas quando aplicável e a permissão principal está ativa */}
                {routeWithTabs[route.id] && isPermissionActive(route.id) && (
                  <div className="ml-6 border-l-2 border-primary/20 pl-4 space-y-2">
                    {routeWithTabs[route.id].map(tab => (
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
                              <TooltipContent className="max-w-xs">
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

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="cancel" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
