
import { Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MonthYearSelectorProps {
  selectedMonthYear: string;
  onMonthYearChange: (value: string) => void;
  options: string[];
}

export const MonthYearSelector = ({
  selectedMonthYear,
  onMonthYearChange,
  options,
}: MonthYearSelectorProps) => (
  <div className="flex items-center gap-2">
    <Calendar className="w-4 h-4 text-muted-foreground" />
    <Select value={selectedMonthYear} onValueChange={onMonthYearChange}>
      <SelectTrigger className="w-[130px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
