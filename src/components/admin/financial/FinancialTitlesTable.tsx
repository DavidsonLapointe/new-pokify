
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FinancialTitle } from "@/types/financial";
import { useTitleStatus } from "./hooks/useTitleStatus";
import { getStatusBadge } from "./table/TitleStatusBadge";
import { TitlePaymentButton } from "./table/TitlePaymentButton";
import { EmptyTitlesState } from "./table/EmptyTitlesState";
import { Organization } from "@/types";

interface FinancialTitlesTableProps {
  titles: FinancialTitle[];
}

// Mock data for organization - in a real app, this would come from a context or props
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

export const FinancialTitlesTable = ({ titles }: FinancialTitlesTableProps) => {
  const { titles: localTitles, setTitles } = useTitleStatus(titles);

  const handlePaymentSuccess = (updatedTitle: FinancialTitle) => {
    setTitles(prev => prev.map(t => 
      t.id === updatedTitle.id ? updatedTitle : t
    ));
  };

  if (localTitles.length === 0) {
    return <EmptyTitlesState />;
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
                <TitlePaymentButton 
                  title={title} 
                  organization={mockOrganization}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
