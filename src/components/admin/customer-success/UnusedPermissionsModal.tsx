
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Phone, Mail, ShieldAlert, LayoutDashboard, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UnusedPermissionOrg {
  id: string;
  name: string;
  adminName: string;
  adminEmail: string;
  adminPhone?: string;
  unusedPermissions: string[];
}

interface UnusedPermissionsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  unusedPermissionsOrgs: UnusedPermissionOrg[];
  isLoading?: boolean;
}

// Helper function to determine if a permission is a tab or a function
const isTab = (permission: string): boolean => {
  // Define keywords that indicate tabs - these are common section names in dashboards
  const tabKeywords = [
    'dashboard', 'painel', 'módulo', 'relatórios', 'configurações', 'análise',
    'integração', 'gestão', 'ferramentas', 'controle'
  ];
  
  // Check if the permission name contains any of the tab keywords
  return tabKeywords.some(keyword => 
    permission.toLowerCase().includes(keyword.toLowerCase())
  );
};

export const UnusedPermissionsModal = ({ 
  isOpen, 
  onOpenChange, 
  unusedPermissionsOrgs, 
  isLoading = false 
}: UnusedPermissionsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Empresas com <span className="text-blue-700">Funções</span> ou <span className="text-purple-700">Abas</span> sem Usuários
          </DialogTitle>
          <DialogDescription>
            Lista de empresas que possuem funções ou abas configuradas mas sem usuários com acesso
          </DialogDescription>
        </DialogHeader>
        
        {/* Legend to identify types */}
        <div className="flex gap-4 mb-4 p-2 bg-slate-50 rounded-md">
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <ShieldAlert className="h-3.5 w-3.5 mr-1" />
              Exemplo
            </Badge>
            <span className="text-sm font-medium">= Funções</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              <LayoutDashboard className="h-3.5 w-3.5 mr-1" />
              Exemplo
            </Badge>
            <span className="text-sm font-medium">= Abas</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto text-xs text-slate-500">
            <HelpCircle className="h-3.5 w-3.5 mr-1" />
            <span>Abas são seções de navegação, funções são permissões específicas</span>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : unusedPermissionsOrgs.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            Não há empresas com funções ou abas sem usuários.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Empresa</TableHead>
                <TableHead>Administrador</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Funções/Abas sem Usuários</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unusedPermissionsOrgs.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell>{org.adminName}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{org.adminEmail}</span>
                      </div>
                      {org.adminPhone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{org.adminPhone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {org.unusedPermissions.map((permission, index) => {
                        const isTabItem = isTab(permission);
                        return (
                          <Badge 
                            key={index}
                            variant="outline" 
                            className={isTabItem 
                              ? "bg-purple-50 text-purple-700 border-purple-200" 
                              : "bg-blue-50 text-blue-700 border-blue-200"
                            }
                          >
                            {isTabItem ? (
                              <LayoutDashboard className="h-3.5 w-3.5 mr-1" />
                            ) : (
                              <ShieldAlert className="h-3.5 w-3.5 mr-1" />
                            )}
                            {permission}
                          </Badge>
                        );
                      })}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
};
