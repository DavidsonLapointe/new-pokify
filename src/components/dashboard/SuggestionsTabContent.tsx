
import React from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MonthYearSelector } from "./MonthYearSelector";
import { SellerSelector } from "./SellerSelector";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { User } from "@/types/organization";
import { toast } from "sonner";

interface Suggestion {
  id: string;
  date: string;
  leadName: string;
  suggestion: string;
  type: string;
  subType: string;
  status: "pending" | "implemented" | "rejected";
}

interface SuggestionsTabContentProps {
  suggestions: Suggestion[];
  monthlySuggestionsDate: Date;
  setMonthlySuggestionsDate: (date: Date) => void;
  monthlySuggestionsSeller: string;
  setMonthlySuggestionsSeller: (seller: string) => void;
  sellers: User[];
  onUpdateStatus?: (id: string, newStatus: "pending" | "implemented" | "rejected") => void;
}

export const SuggestionsTabContent = ({
  suggestions,
  monthlySuggestionsDate,
  setMonthlySuggestionsDate,
  monthlySuggestionsSeller,
  setMonthlySuggestionsSeller,
  sellers,
  onUpdateStatus,
}: SuggestionsTabContentProps) => {
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [subTypeFilter, setSubTypeFilter] = React.useState("all");

  // Extrair tipos e subtipos únicos
  const types = React.useMemo(() => {
    const uniqueTypes = new Set(suggestions.map(s => s.type));
    return Array.from(uniqueTypes);
  }, [suggestions]);

  const subTypes = React.useMemo(() => {
    const uniqueSubTypes = new Set(suggestions.map(s => s.subType));
    return Array.from(uniqueSubTypes);
  }, [suggestions]);

  // Filtrar sugestões
  const filteredSuggestions = React.useMemo(() => {
    return suggestions.filter(suggestion => {
      if (typeFilter !== "all" && suggestion.type !== typeFilter) return false;
      if (subTypeFilter !== "all" && suggestion.subType !== subTypeFilter) return false;
      return true;
    });
  }, [suggestions, typeFilter, subTypeFilter]);

  // Função para renderizar o badge de status
  const renderStatusBadge = (status: string) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      implemented: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    }[status];

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses}`}>
        {status === "pending" && "Pendente"}
        {status === "implemented" && "Implementada"}
        {status === "rejected" && "Rejeitada"}
      </span>
    );
  };

  // Função para atualizar o status
  const handleStatusUpdate = (id: string, newStatus: "pending" | "implemented" | "rejected") => {
    onUpdateStatus?.(id, newStatus);
    toast.success("Status atualizado com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <MonthYearSelector
            selectedDate={monthlySuggestionsDate}
            onDateChange={setMonthlySuggestionsDate}
          />
        </Card>
        <Card className="p-4">
          <SellerSelector
            selectedSeller={monthlySuggestionsSeller}
            onSellerChange={setMonthlySuggestionsSeller}
            sellers={sellers}
          />
        </Card>
        <Card className="p-4">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              {types.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>
        <Card className="p-4">
          <Select value={subTypeFilter} onValueChange={setSubTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por Sub-tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Sub-tipos</SelectItem>
              {subTypes.map((subType) => (
                <SelectItem key={subType} value={subType}>{subType}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>
      </div>

      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Lead</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Sub-tipo</TableHead>
              <TableHead className="max-w-[500px]">Sugestão</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((suggestion) => (
                <TableRow key={suggestion.id}>
                  <TableCell>{new Date(suggestion.date).toLocaleDateString()}</TableCell>
                  <TableCell>{suggestion.leadName}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {suggestion.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                      {suggestion.subType}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[500px] whitespace-normal">
                    {suggestion.suggestion}
                  </TableCell>
                  <TableCell>{renderStatusBadge(suggestion.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusUpdate(suggestion.id, "implemented")}
                        className="text-green-600 hover:text-green-700"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusUpdate(suggestion.id, "rejected")}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusUpdate(suggestion.id, "pending")}
                        className="text-yellow-600 hover:text-yellow-700"
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Nenhuma sugestão encontrada para o período selecionado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
