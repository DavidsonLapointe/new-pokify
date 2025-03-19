
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, subMonths, isValid, addMonths, parseISO, startOfMonth, endOfMonth } from "date-fns";

interface MonthYearSelectorProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  showAllOption?: boolean;
  billingData?: Array<{ date: string; amount: number }>;
}

export const MonthYearSelector = ({ 
  selectedDate, 
  onDateChange, 
  showAllOption = false,
  billingData = []
}: MonthYearSelectorProps) => {
  // Generate the last 14 months as options
  const allMonthOptions = Array.from({ length: 14 }).map((_, index) => {
    // For the first 12 entries, use subMonths (past dates)
    // For the last 2 entries, use addMonths to get future dates (including February 2025)
    const date = index < 12 
      ? subMonths(new Date(), index) 
      : addMonths(new Date(), index - 10); // Skip to future months
    
    const value = format(date, "yyyy-MM");
    const label = format(date, "MM/yyyy");
    return { value, label, date };
  });

  // Filter months that have at least one day with billing data
  const monthOptions = billingData.length > 0
    ? allMonthOptions.filter(option => {
        const monthStart = startOfMonth(option.date);
        const monthEnd = endOfMonth(option.date);
        
        // Check if there's at least one day with billing in this month
        return billingData.some(item => {
          const itemDate = parseISO(item.date);
          if (!isValid(itemDate)) return false;
          
          return itemDate >= monthStart && itemDate <= monthEnd && item.amount > 0;
        });
      })
    : allMonthOptions; // If no billing data provided, show all options

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
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Selecione o mês/ano" />
      </SelectTrigger>
      <SelectContent>
        {showAllOption && <SelectItem value="all">Todos os meses</SelectItem>}
        {monthOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
