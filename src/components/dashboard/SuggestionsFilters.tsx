
import React from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { MonthYearSelector } from "./MonthYearSelector";
import { SellerSelector } from "./SellerSelector";
import { SuggestionsFiltersProps } from "./types/suggestions";

export const SuggestionsFilters = ({
  typeFilter,
  setTypeFilter,
  subTypeFilter,
  setSubTypeFilter,
  statusFilter,
  setStatusFilter,
  monthlySuggestionsDate,
  setMonthlySuggestionsDate,
  monthlySuggestionsSeller,
  setMonthlySuggestionsSeller,
  sellers,
  types,
  subTypes,
  onClearFilters,
}: SuggestionsFiltersProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Filtros</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-2" />
            Limpar filtros
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-5">
          <div>
            <MonthYearSelector
              selectedDate={monthlySuggestionsDate}
              onDateChange={setMonthlySuggestionsDate}
            />
          </div>
          <div>
            <SellerSelector
              selectedSeller={monthlySuggestionsSeller}
              onSellerChange={setMonthlySuggestionsSeller}
              sellers={sellers}
            />
          </div>
          <div>
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
          </div>
          <div>
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
          </div>
          <div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="implemented">Implementada</SelectItem>
                <SelectItem value="rejected">Rejeitada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
};
