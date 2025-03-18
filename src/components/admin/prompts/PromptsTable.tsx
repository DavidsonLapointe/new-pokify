
import { Prompt } from "@/types/prompt";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";
import { useCompanies } from "@/hooks/admin/prompts/useCompanies";

interface PromptsTableProps {
  prompts: Prompt[];
  onEdit: (prompt: Prompt) => void;
  onView: (prompt: Prompt) => void;
}

export const PromptsTable = ({ prompts, onEdit, onView }: PromptsTableProps) => {
  // Get companies data for displaying company names with custom prompts
  const { companies, isLoading } = useCompanies();
  
  // Function to get company name by ID
  const getCompanyName = (companyId?: string) => {
    if (!companyId) return "";
    const company = companies.find(c => c.id === companyId);
    return company ? (company.nome_fantasia || company.razao_social) : "";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Nome</TableHead>
            {prompts.some(prompt => prompt.type === "custom") && (
              <TableHead className="hidden md:table-cell">Empresa</TableHead>
            )}
            <TableHead className="w-[130px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prompts.map((prompt) => (
            <TableRow key={prompt.id}>
              <TableCell className="font-medium">{prompt.name}</TableCell>
              {prompts.some(p => p.type === "custom") && (
                <TableCell className="hidden md:table-cell">
                  {prompt.type === "custom" && (
                    <span className="text-sm text-muted-foreground">
                      {isLoading ? "Carregando..." : getCompanyName(prompt.company_id)}
                    </span>
                  )}
                </TableCell>
              )}
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={() => onView(prompt)}
                    title="Visualizar prompt"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={() => onEdit(prompt)}
                    title="Editar prompt"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
