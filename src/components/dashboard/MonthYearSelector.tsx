
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, subMonths } from "date-fns";

interface MonthYearSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const MonthYearSelector = ({ selectedDate, onDateChange }: MonthYearSelectorProps) => {
  // Gera os últimos 12 meses como opções
  const monthOptions = Array.from({ length: 12 }).map((_, index) => {
    const date = subMonths(new Date(), index);
    const value = format(date, "yyyy-MM");
    const label = format(date, "MMMM/yyyy");
    return { value, label, date };
  });

  return (
    <Select
      value={format(selectedDate, "yyyy-MM")}
      onValueChange={(newValue) => {
        const selectedOption = monthOptions.find(option => option.value === newValue);
        if (selectedOption) {
          onDateChange(selectedOption.date);
        }
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Selecione o mês/ano" />
      </SelectTrigger>
      <SelectContent>
        {monthOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
