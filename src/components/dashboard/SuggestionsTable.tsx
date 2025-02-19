
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
import { toast } from "sonner";
import { SuggestionTableProps } from "./types/suggestions";

export const SuggestionsTable = ({ suggestions, onUpdateStatus }: SuggestionTableProps) => {
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

  const handleStatusUpdate = (id: string, newStatus: "pending" | "implemented" | "rejected") => {
    onUpdateStatus?.(id, newStatus);
    toast.success("Status atualizado com sucesso!");
  };

  return (
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
          {suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
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
                  <Select
                    value={suggestion.status}
                    onValueChange={(value: "pending" | "implemented" | "rejected") => 
                      handleStatusUpdate(suggestion.id, value)
                    }
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Alterar status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="implemented">Implementada</SelectItem>
                      <SelectItem value="rejected">Rejeitada</SelectItem>
                    </SelectContent>
                  </Select>
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
  );
};
