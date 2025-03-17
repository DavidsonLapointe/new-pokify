
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FinancialTitle } from "@/types/financial";
import { useTitleStatus } from "./hooks/useTitleStatus";
import { getStatusBadge } from "./table/TitleStatusBadge";
import { TitlePaymentButton } from "./table/TitlePaymentButton";
import { EmptyTitlesState } from "./table/EmptyTitlesState";
import { Organization } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

interface FinancialTitlesTableProps {
  titles: FinancialTitle[];
}

// Mock data for organization - in a real app, this would come from a context or props
const mockOrganization: Organization = {
  id: "1",
  name: "Tech Solutions",
  nomeFantasia: "Tech Solutions Ltda",
  plan: "Enterprise",
  planName: "Enterprise",
  users: [],
  status: "pending",
  pendingReason: "contract_signature",
  contractStatus: "pending" as const,
  paymentStatus: "pending" as const,
  registrationStatus: "pending" as const,
  integratedCRM: null,
  integratedLLM: null,
  email: "contact@example.com",
  phone: "(11) 99999-9999",
  cnpj: "12.345.678/0001-00",
  adminName: "Admin",
  adminEmail: "admin@example.com",
  contractSignedAt: null,
  createdAt: "2024-01-01T00:00:00.000Z"
};

export const FinancialTitlesTable = ({ titles }: FinancialTitlesTableProps) => {
  const { titles: localTitles, setTitles } = useTitleStatus(titles);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handlePaymentSuccess = (updatedTitle: FinancialTitle) => {
    setTitles(prev => prev.map(t => 
      t.id === updatedTitle.id ? updatedTitle : t
    ));
  };

  if (localTitles.length === 0) {
    return <EmptyTitlesState />;
  }

  // Cálculo para paginação
  const totalPages = Math.ceil(localTitles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTitles = localTitles.slice(startIndex, endIndex);

  // Função para gerar os itens de paginação
  const renderPaginationItems = () => {
    const items = [];
    
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  return (
    <div className="space-y-4">
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
            {currentTitles.map((title) => (
              <TableRow key={title.id}>
                <TableCell>{title.organization?.name}</TableCell>
                <TableCell>
                  {title.type === "pro_rata" && "Pro Rata"}
                  {title.type === "mensalidade" && (
                    <>
                      Mensalidade
                      {title.referenceMonth && ` - ${format(new Date(title.referenceMonth), 'MMMM/yyyy', { locale: ptBR })}`}
                    </>
                  )}
                  {title.type === "setup" && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5">
                            <span>Setup</span>
                            {title.moduleName && (
                              <span className="bg-primary-lighter text-primary text-xs px-2 py-0.5 rounded-full">
                                {title.moduleName}
                              </span>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Cobrança de setup pela contratação de módulo</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
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
                <TableCell>{getStatusBadge({ 
                  status: title.status, 
                  paymentStatusDetails: title.paymentStatusDetails 
                })}</TableCell>
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
      
      {/* Componente de paginação */}
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(1)} 
                />
              </PaginationItem>
            )}
            
            {renderPaginationItems()}
            
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(totalPages)} 
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
