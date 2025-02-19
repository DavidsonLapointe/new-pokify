
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types/organization";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface UserPermissionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUserUpdate: (user: User) => void;
}

// Definição das funções do menu lateral
const menuFunctions = [
  { id: "dashboard", label: "Dashboard", icon: "BarChart3" },
  { id: "leads", label: "Análise de Leads", icon: "Headphones" },
  { id: "users", label: "Usuários", icon: "Users", adminOnly: true },
  { id: "integrations", label: "Integrações", icon: "Network", adminOnly: true },
  { id: "settings", label: "Configurações", icon: "Settings", adminOnly: true },
  { id: "plan", label: "Meu Plano", icon: "CreditCard" },
  { id: "profile", label: "Meu Perfil", icon: "UserCircle", alwaysEnabled: true }
];

export const UserPermissionsDialog = ({
  isOpen,
  onClose,
  user,
  onUserUpdate,
}: UserPermissionsDialogProps) => {
  if (!user) return null;

  const handlePermissionChange = (functionId: string, checked: boolean) => {
    // Não permite alteração se for a função "Meu Perfil"
    if (functionId === "profile") return;

    const updatedPermissions = {
      ...user.permissions,
      menuAccess: {
        ...user.permissions.menuAccess,
        [functionId]: checked
      }
    };

    onUserUpdate({
      ...user,
      permissions: updatedPermissions
    });
  };

  const handleSave = () => {
    toast.success("Permissões atualizadas com sucesso!");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Permissões do Usuário</DialogTitle>
          <DialogDescription>
            Configure as funções que {user.name} poderá acessar
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {menuFunctions.map((menuItem) => (
            <div key={menuItem.id} className="flex items-center space-x-3">
              <Checkbox
                id={menuItem.id}
                checked={menuItem.alwaysEnabled || user.permissions?.menuAccess?.[menuItem.id]}
                onCheckedChange={(checked) => handlePermissionChange(menuItem.id, checked as boolean)}
                disabled={menuItem.alwaysEnabled || (menuItem.adminOnly && user.role !== "company_admin")}
              />
              <label
                htmlFor={menuItem.id}
                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                  menuItem.alwaysEnabled ? "text-primary" : ""
                }`}
              >
                {menuItem.label}
                {menuItem.alwaysEnabled && (
                  <span className="ml-2 text-xs text-muted-foreground">(Sempre ativo)</span>
                )}
                {menuItem.adminOnly && user.role !== "company_admin" && (
                  <span className="ml-2 text-xs text-muted-foreground">(Apenas administradores)</span>
                )}
              </label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
