
import { GenerateMonthlyTitlesButton } from "./GenerateMonthlyTitlesButton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FinancialHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-semibold">Financeiro</h1>
      <div className="flex gap-4">
        <Button 
          variant="outline"
          onClick={() => navigate('/admin/organizations')}
        >
          Gerenciar Organizações
        </Button>
        <GenerateMonthlyTitlesButton />
      </div>
    </div>
  );
};

export default FinancialHeader;
