
import { MonthYearSelector } from "@/components/dashboard/MonthYearSelector";

interface ObjectionsFiltersProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const ObjectionsFilters = ({ selectedDate, onDateChange }: ObjectionsFiltersProps) => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">Análise de Objeções</h3>
      <MonthYearSelector selectedDate={selectedDate} onDateChange={onDateChange} />
    </div>
  );
};
