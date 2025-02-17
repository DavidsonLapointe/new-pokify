
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { FinancialTitle, TitleStatus } from "@/types/financial";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Mock data - em produção viria da API
const mockTitles: FinancialTitle[] = [
  {
    id: "1",
    organizationId: 1,
    organizationName: "Tech Solutions Ltda",
    type: "pro_rata",
    value: 156.67,
    dueDate: "2024-03-20",
    status: "pending",
    createdAt: "2024-03-15",
  },
  {
    id: "2",
    organizationId: 1,
    organizationName: "Tech Solutions Ltda",
    type: "mensalidade",
    value: 500.00,
    dueDate: "2024-04-05",
    status: "pending",
    referenceMonth: "2024-04",
    createdAt: "2024-04-01",
  },
];

const getStatusBadge = (status: TitleStatus) => {
  const variants = {
    pending: "default",
    paid: "secondary",
    overdue: "destructive",
  };

  const labels = {
    pending: "Pendente",
    paid: "Pago",
    overdue: "Vencido",
  };

  return (
    <Badge variant={variants[status]}>
      {labels[status]}
    </Badge>
  );
};

export const FinancialTitlesTable = () => {
  const { toast } = useToast();
  const [titles, setTitles] = useState<FinancialTitle[]>(mockTitles);

  const handlePayment = (titleId: string) => {
    setTitles(prev => prev.map(title => {
      if (title.id === titleId) {
        return {
          ...title,
          status: "paid" as const,
          paymentDate: new Date().toISOString(),
        };
      }
      return title;
    }));

    toast({
      title: "Título baixado com sucesso",
      description: "O pagamento foi registrado e o título foi baixado.",
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empresa</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {titles.map((title) => (
            <TableRow key={title.id}>
              <TableCell>{title.organizationName}</TableCell>
              <TableCell>
                {title.type === "pro_rata" ? "Pro Rata" : "Mensalidade"}
                {title.referenceMonth && ` - ${format(new Date(title.referenceMonth), 'MMMM/yyyy', { locale: ptBR })}`}
              </TableCell>
              <TableCell>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(title.value)}
              </TableCell>
              <TableCell>
                {format(new Date(title.dueDate), 'dd/MM/yyyy')}
              </TableCell>
              <TableCell>{getStatusBadge(title.status)}</TableCell>
              <TableCell>
                {title.status === "pending" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePayment(title.id)}
                  >
                    Baixar Título
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
