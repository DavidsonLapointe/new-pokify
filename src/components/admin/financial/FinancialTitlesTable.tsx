
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Organization } from "@/types/organization";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FinancialTitle {
  id: string;
  description: string;
  dueDate: string;
  amount: number;
  status: "pending" | "paid" | "overdue";
}

interface FinancialTitlesTableProps {
  organization: Organization;
  titles: FinancialTitle[];
}

const getStatusColor = (status: FinancialTitle["status"]) => {
  switch (status) {
    case "pending":
      return "text-yellow-600";
    case "paid":
      return "text-green-600";
    case "overdue":
      return "text-red-600";
    default:
      return "";
  }
};

const getStatusText = (status: FinancialTitle["status"]) => {
  switch (status) {
    case "pending":
      return "Pendente";
    case "paid":
      return "Pago";
    case "overdue":
      return "Vencido";
    default:
      return status;
  }
};

export const FinancialTitlesTable = ({ organization, titles }: FinancialTitlesTableProps) => {
  const formatDate = (date: string) => {
    return format(new Date(date), "dd 'de' MMMM, yyyy", { locale: ptBR });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {titles.map((title) => (
          <TableRow key={title.id}>
            <TableCell>{title.description}</TableCell>
            <TableCell>{formatDate(title.dueDate)}</TableCell>
            <TableCell>{formatCurrency(title.amount)}</TableCell>
            <TableCell>
              <span className={`font-medium ${getStatusColor(title.status)}`}>
                {getStatusText(title.status)}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => console.log("View details", title.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                {title.status === "paid" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => console.log("Download invoice", title.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
