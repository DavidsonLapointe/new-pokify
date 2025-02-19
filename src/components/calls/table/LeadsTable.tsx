
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LeadCalls } from "@/components/calls/types";
import { Search, History, Upload } from "lucide-react";

interface LeadsTableProps {
  leads: LeadCalls[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  formatDate: (date: string) => string;
  onShowHistory: (lead: LeadCalls) => void;
  onShowUpload: (lead: LeadCalls) => void;
}

export const LeadsTable = ({
  leads,
  searchQuery,
  setSearchQuery,
  formatDate,
  onShowHistory,
  onShowUpload,
}: LeadsTableProps) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar leads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Funil</TableHead>
              <TableHead>Etapa</TableHead>
              <TableHead>Data de Cadastro</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  {lead.personType === "pf"
                    ? `${lead.firstName} ${lead.lastName}`
                    : lead.razaoSocial}
                </TableCell>
                <TableCell>
                  {lead.personType === "pf" ? "Pessoa Física" : "Pessoa Jurídica"}
                </TableCell>
                <TableCell>{lead.crmInfo?.funnel || "-"}</TableCell>
                <TableCell>{lead.crmInfo?.stage || "-"}</TableCell>
                <TableCell>{formatDate(lead.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onShowHistory(lead)}
                    >
                      <History className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onShowUpload(lead)}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
