
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { TitleStatus, TitleType } from "@/types/financial";
import { Label } from "@/components/ui/label";

interface FilterFieldsProps {
  status: TitleStatus | "all";
  type: TitleType | "all";
  search: string;
  onStatusChange: (value: TitleStatus | "all") => void;
  onTypeChange: (value: TitleType | "all") => void;
  onSearchChange: (value: string) => void;
}

export const FilterFields = ({
  status,
  type,
  search,
  onStatusChange,
  onTypeChange,
  onSearchChange
}: FilterFieldsProps) => {
  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor="status-select" className="text-sm text-muted-foreground">
          Status de Pagamento
        </Label>
        <Select value={status} onValueChange={(value: TitleStatus | "all") => onStatusChange(value)}>
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
        <Select value={type} onValueChange={(value: TitleType | "all") => onTypeChange(value)}>
          <SelectTrigger id="type-select" className="w-[180px]">
            <SelectValue placeholder="Tipo de Título" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="pro_rata">Pro Rata</SelectItem>
            <SelectItem value="mensalidade">Mensalidade</SelectItem>
            <SelectItem value="setup">Setup</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5 flex-1">
        <Label htmlFor="search-input" className="text-sm text-muted-foreground">
          Buscar Empresa
        </Label>
        <Input
          id="search-input"
          placeholder="Buscar por razão social, nome fantasia ou CNPJ..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              // Handled by parent component
            }
          }}
        />
      </div>
    </>
  );
};
