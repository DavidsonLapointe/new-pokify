
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MonthYearSelector } from "@/components/dashboard/MonthYearSelector";

interface CallsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedMonthYear: string;
  onMonthYearChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  monthYearOptions: string[];
}

export const CallsFilters = ({
  searchQuery,
  onSearchChange,
  selectedMonthYear,
  onMonthYearChange,
  selectedStatus,
  onStatusChange,
  monthYearOptions,
}: CallsFiltersProps) => {
  return (
    <div className="flex gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Buscar por telefone ou vendedor..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <MonthYearSelector
        selectedMonthYear={selectedMonthYear}
        onMonthYearChange={onMonthYearChange}
        options={monthYearOptions}
      />
      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="processed">Processadas</SelectItem>
          <SelectItem value="pending">Pendentes</SelectItem>
          <SelectItem value="failed">Com erro</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
