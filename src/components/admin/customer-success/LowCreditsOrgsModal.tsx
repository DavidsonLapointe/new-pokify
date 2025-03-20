
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Phone, Mail, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface LowCreditsOrg {
  id: string;
  name: string;
  adminName: string;
  adminEmail: string;
  adminPhone?: string;
  remainingCredits: number;
  lastAccessDate: string;
  lastAccessUser: string;
}

interface LowCreditsOrgsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  lowCreditsOrgs: LowCreditsOrg[];
  isLoading?: boolean;
}

export const LowCreditsOrgsModal = ({ isOpen, onOpenChange, lowCreditsOrgs, isLoading = false }: LowCreditsOrgsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Empresas com menos de 50 créditos</DialogTitle>
          <DialogDescription>
            Lista de empresas com baixo saldo de créditos disponível
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : lowCreditsOrgs.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            Não há empresas com saldo inferior a 50 créditos.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Empresa</TableHead>
                <TableHead>Administrador</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Créditos</TableHead>
                <TableHead>Último Acesso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowCreditsOrgs.map((org) => (
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
                    <Badge 
                      variant="outline" 
                      className="bg-amber-50 text-amber-600 border-amber-200 flex items-center w-fit"
                    >
                      <CreditCard className="h-3.5 w-3.5 mr-1" />
                      {org.remainingCredits} créditos
                    </Badge>
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
