
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Phone, Mail } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface InactiveOrg {
  id: string;
  name: string;
  adminName: string;
  adminEmail: string;
  adminPhone?: string;
  lastAccessDate: string;
  lastAccessUser: string;
}

interface InactiveOrgsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  inactiveOrgs: InactiveOrg[];
  isLoading?: boolean;
}

export const InactiveOrgsModal = ({ isOpen, onOpenChange, inactiveOrgs, isLoading = false }: InactiveOrgsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Empresas Sem Acesso (+ de 5 dias)</DialogTitle>
          <DialogDescription>
            Lista de empresas onde nenhum usuário fez login nos últimos 5 dias
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : inactiveOrgs.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            Não há empresas sem acesso há mais de 5 dias.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Empresa</TableHead>
                <TableHead>Administrador</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Último Acesso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inactiveOrgs.map((org) => (
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
                    <div className="flex flex-col">
                      <span>
                        {format(new Date(org.lastAccessDate), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {org.lastAccessUser}
                      </span>
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
