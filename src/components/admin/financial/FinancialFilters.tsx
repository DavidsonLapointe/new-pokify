
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TitleStatus, TitleType } from "@/types/financial";
import { FilterX, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

interface FinancialFiltersProps {
  onSearch: (filters: { status: TitleStatus | "all", type: TitleType | "all", search: string }) => void;
}

export const FinancialFilters = ({ onSearch }: FinancialFiltersProps) => {
  const { toast } = useToast();
  const [status, setStatus] = useState<TitleStatus | "all">("all");
  const [type, setType] = useState<TitleType | "all">("all");
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    onSearch({ status, type, search });
    toast({
      title: "Filtros aplicados",
      description: "A lista foi atualizada com os filtros selecionados.",
    });
  };

  const handleClearFilters = () => {
    setStatus("all");
    setType("all");
    setSearch("");
    onSearch({ status: "all", type: "all", search: "" });
    toast({
      title: "Filtros limpos",
      description: "Todos os filtros foram removidos.",
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="space-y-1.5">
        <Label htmlFor="status-select" className="text-sm text-muted-foreground">
          Status de Pagamento
        </Label>
        <Select value={status} onValueChange={(value: TitleStatus | "all") => setStatus(value)}>
          <SelectTrigger id="status-select" className="w-[180px]">
            <SelectValue placeholder="Status de Pagamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="paid">Pago</SelectItem>
            <SelectItem value="overdue">Vencido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="type-select" className="text-sm text-muted-foreground">
          Tipo de Título
        </Label>
        <Select value={type} onValueChange={(value: TitleType | "all") => setType(value)}>
          <SelectTrigger id="type-select" className="w-[180px]">
            <SelectValue placeholder="Tipo de Título" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="pro_rata">Pro Rata</SelectItem>
            <SelectItem value="mensalidade">Mensalidade</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 space-y-1.5">
        <Label htmlFor="search-input" className="text-sm text-muted-foreground">
          Nome da Empresa
        </Label>
        <div className="flex gap-2">
          <Input
            id="search-input"
            placeholder="Buscar por empresa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <Button 
            variant="default"
            onClick={handleSearch}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Buscar
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
            onClick={handleClearFilters}
          >
            <FilterX className="h-4 w-4" />
            Limpar Filtros
          </Button>
        </div>
      </div>
    </div>
  );
};
