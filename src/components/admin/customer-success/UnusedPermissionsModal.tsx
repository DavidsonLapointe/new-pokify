
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Phone, Mail, ShieldAlert } from "lucide-react";
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
          <DialogTitle>Empresas com Funções ou Abas sem Usuários</DialogTitle>
          <DialogDescription>
            Lista de empresas que possuem funções ou abas configuradas mas sem usuários com acesso
          </DialogDescription>
        </DialogHeader>
        
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
                      {org.unusedPermissions.map((permission, index) => (
                        <Badge 
                          key={index}
                          variant="outline" 
                          className="bg-blue-50 text-blue-600 border-blue-200"
                        >
                          <ShieldAlert className="h-3.5 w-3.5 mr-1" />
                          {permission}
                        </Badge>
                      ))}
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
