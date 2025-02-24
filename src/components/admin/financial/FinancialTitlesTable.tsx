
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { FinancialTitle, TitleStatus } from "@/types/financial";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { handleTitlePayment } from "@/services/financialService";
import { Organization } from "@/types";
import { SearchX } from "lucide-react";

interface FinancialTitlesTableProps {
  titles: FinancialTitle[];
}

const mockOrganization: Organization = {
  id: "1",
  name: "Tech Solutions",
  nomeFantasia: "Tech Solutions Ltda",
  plan: "Enterprise",
  users: [],
  status: "pending",
  integratedCRM: null,
  integratedLLM: null,
  email: "contact@example.com",
  phone: "(11) 99999-9999",
  cnpj: "12.345.678/0001-00",
  adminName: "Admin",
  adminEmail: "admin@example.com",
  createdAt: "2024-01-01T00:00:00.000Z"
};

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

const checkTitleStatus = (title: FinancialTitle): TitleStatus => {
  if (title.status === "paid") return "paid";
  
  const today = new Date();
  const dueDate = new Date(title.dueDate);
  
  if (isBefore(dueDate, today)) {
    return "overdue";
  }
  
  return "pending";
};

export const FinancialTitlesTable = ({ titles }: FinancialTitlesTableProps) => {
  const { toast } = useToast();
  const [localTitles, setLocalTitles] = useState<FinancialTitle[]>(titles);

  useEffect(() => {
    setLocalTitles(titles);
  }, [titles]);

  useEffect(() => {
    const updateTitlesStatus = () => {
      setLocalTitles(prevTitles => 
        prevTitles.map(title => ({
          ...title,
          status: checkTitleStatus(title)
        }))
      );
    };

    updateTitlesStatus();
    const interval = setInterval(updateTitlesStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const handlePayment = async (title: FinancialTitle) => {
    try {
      const updatedTitle = await handleTitlePayment(title, mockOrganization);
      
      setLocalTitles(prev => prev.map(t => 
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

  if (localTitles.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <SearchX className="h-12 w-12 text-gray-400 mb-3" />
          <h3 className="font-semibold text-lg mb-1">Nenhum título encontrado</h3>
          <p className="text-sm text-gray-500">
            Não foram encontrados títulos com os critérios de busca selecionados.
          </p>
        </div>
      </div>
    );
  }

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
          {localTitles.map((title) => (
            <TableRow key={title.id}>
              <TableCell>{title.organization?.name}</TableCell>
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
                {(title.status === "pending" || title.status === "overdue") && (
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
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
