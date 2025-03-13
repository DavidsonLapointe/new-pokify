
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, subMonths, isValid } from "date-fns";

interface MonthYearSelectorProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
}

export const MonthYearSelector = ({ selectedDate, onDateChange }: MonthYearSelectorProps) => {
  // Gera os últimos 12 meses como opções
  const monthOptions = Array.from({ length: 12 }).map((_, index) => {
    const date = subMonths(new Date(), index);
    const value = format(date, "yyyy-MM");
    const label = format(date, "MM/yyyy");
    return { value, label, date };
  });

  return (
    <Select
      value={selectedDate ? format(selectedDate, "yyyy-MM") : "all"}
      onValueChange={(newValue) => {
        if (newValue === "all") {
          onDateChange(null);
        } else {
          const selectedOption = monthOptions.find(option => option.value === newValue);
          if (selectedOption) {
            onDateChange(selectedOption.date);
          }
        }
      }}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Selecione o mês/ano" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos os meses</SelectItem>
        {monthOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
