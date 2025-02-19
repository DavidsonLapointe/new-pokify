
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
import { MonthYearSelector } from "./MonthYearSelector";
import { SellerSelector } from "./SellerSelector";
import { User } from "@/types/organization";

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
}

export const SuggestionsTabContent = ({
  suggestions,
  monthlySuggestionsDate,
  setMonthlySuggestionsDate,
  monthlySuggestionsSeller,
  setMonthlySuggestionsSeller,
  sellers,
}: SuggestionsTabContentProps) => {
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

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
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
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
