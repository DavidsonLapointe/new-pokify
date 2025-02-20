
import { ObjectionsFilters } from "@/components/objections/ObjectionsFilters";
import { ObjectionsStats } from "@/components/objections/ObjectionsStats";
import { MonthlyObjectionsChart } from "@/components/objections/MonthlyObjectionsChart";
import { ObjectionTrendsChart } from "@/components/objections/ObjectionTrendsChart";
import { ObjectionDetails } from "@/components/objections/ObjectionDetails";
import { User } from "@/types";

interface ObjectionsTabContentProps {
  objectionsData: any[];
  objectionTrendsData: any[];
  objectionExamples: Record<string, string[]>;
  monthlyObjectionsDate: Date;
  setMonthlyObjectionsDate: (date: Date) => void;
  monthlyObjectionsSeller: string;
  setMonthlyObjectionsSeller: (seller: string) => void;
  objectionTrendsSeller: string;
  setObjectionTrendsSeller: (seller: string) => void;
  sellers: User[];
}

export const ObjectionsTabContent = ({
  objectionsData,
  objectionTrendsData,
  objectionExamples,
  monthlyObjectionsDate,
  setMonthlyObjectionsDate,
  monthlyObjectionsSeller,
  setMonthlyObjectionsSeller,
  objectionTrendsSeller,
  setObjectionTrendsSeller,
  sellers,
}: ObjectionsTabContentProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <MonthlyObjectionsChart 
          data={objectionsData}
          selectedDate={monthlyObjectionsDate}
          onDateChange={setMonthlyObjectionsDate}
          selectedSeller={monthlyObjectionsSeller}
          onSellerChange={setMonthlyObjectionsSeller}
          sellers={sellers}
        />
        <ObjectionTrendsChart 
          data={objectionTrendsData}
          selectedDate={monthlyObjectionsDate}
          onDateChange={setMonthlyObjectionsDate}
          selectedSeller={objectionTrendsSeller}
          onSellerChange={setObjectionTrendsSeller}
          sellers={sellers}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ObjectionDetails
            objection="Preço muito alto"
            count={28}
            previousCount={22}
            examples={objectionExamples["Preço muito alto"]}
          />
          <ObjectionDetails
            objection="Não tenho orçamento no momento"
            count={24}
            previousCount={28}
            examples={objectionExamples["Não tenho orçamento no momento"]}
          />
        </div>
      </div>
    </div>
  );
};
