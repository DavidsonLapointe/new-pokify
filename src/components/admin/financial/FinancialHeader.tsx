
import { GenerateMonthlyTitlesButton } from "./GenerateMonthlyTitlesButton";

const FinancialHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-semibold">Financeiro</h1>
      <GenerateMonthlyTitlesButton />
    </div>
  );
};

export default FinancialHeader;
