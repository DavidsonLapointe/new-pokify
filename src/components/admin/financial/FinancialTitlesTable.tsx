import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { FinancialTitle, TitleStatus } from "@/types/financial";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { handleTitlePayment } from "@/services/financialService";
import { Organization } from "@/types/organization";

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
  const variants: Record<TitleStatus, "default" | "secondary" | "destructive"> = {
    pending: "default",
    paid: "secondary",
    overdue: "destructive",
  };

  const labels: Record<TitleStatus, string> = {
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

const mockOrganization: Organization = {
  id: 1,
  name: "Tech Solutions",
  nomeFantasia: "Tech Solutions Ltda",
  plan: "Enterprise",
  users: [
    {
      id: 1,
      name: "Admin",
      email: "admin@example.com",
      phone: "(11) 99999-9999",
      role: "admin",
      status: "pending",
      createdAt: new Date().toISOString(),
      lastAccess: new Date().toISOString(),
      permissions: {},
      logs: [],
    },
  ],
  status: "pending",
  integratedCRM: null,
  integratedLLM: null,
  email: "contact@example.com",
  phone: "(11) 99999-9999",
  cnpj: "12.345.678/0001-00",
  adminName: "Admin",
  adminEmail: "admin@example.com",
  createdAt: "2024-01-01T00:00:00.000Z",
};

export const FinancialTitlesTable = () => {
  const { toast } = useToast();
  const [titles, setTitles] = useState<FinancialTitle[]>(mockTitles);

  const handlePayment = async (title: FinancialTitle) => {
    try {
      // Em produção, você buscaria a organização da API
      const updatedTitle = await handleTitlePayment(title, mockOrganization);
      
      setTitles(prev => prev.map(t => 
        t.id === title.id ? updatedTitle : t
      ));

      toast({
        title: "Título baixado com sucesso",
        description: title.type === "pro_rata" 
          ? "O pagamento foi registrado, a organização e o usuário admin foram ativados."
          : "O pagamento foi registrado e o título foi baixado.",
      });
    } catch (error) {
      toast({
        title: "Erro ao processar pagamento",
        description: "Ocorreu um erro ao tentar baixar o título.",
        variant: "destructive",
      });
    }
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
                    onClick={() => handlePayment(title)}
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
