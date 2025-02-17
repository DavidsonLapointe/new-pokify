
import { DollarSign } from "lucide-react";

export const FinancialHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <DollarSign className="h-8 w-8" />
          Financeiro
        </h1>
        <p className="text-muted-foreground">
          Gerencie os títulos financeiros do sistema
        </p>
      </div>
    </div>
  );
};
