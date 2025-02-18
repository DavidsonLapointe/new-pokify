
import { ObjectionsFilters } from "@/components/objections/ObjectionsFilters";
import { ObjectionsStats } from "@/components/objections/ObjectionsStats";
import { MonthlyObjectionsChart } from "@/components/objections/MonthlyObjectionsChart";
import { ObjectionTrendsChart } from "@/components/objections/ObjectionTrendsChart";
import { ObjectionDetails } from "@/components/objections/ObjectionDetails";
import { User } from "@/types/organization";

interface ObjectionsTabContentProps {
  objectionsData: any[];
  objectionTrendsData: any[];
  objectionExamples: Record<string, string[]>;
  objectionsDate: Date;
  setObjectionsDate: (date: Date) => void;
  objectionsSeller: string;
  setObjectionsSeller: (seller: string) => void;
  sellers: User[];
}

export const ObjectionsTabContent = ({
  objectionsData,
  objectionTrendsData,
  objectionExamples,
  objectionsDate,
  setObjectionsDate,
  objectionsSeller,
  setObjectionsSeller,
  sellers,
}: ObjectionsTabContentProps) => {
  return (
    <div className="space-y-6">
      <ObjectionsFilters
        selectedDate={objectionsDate}
        onDateChange={setObjectionsDate}
      />
      <ObjectionsStats
        totalObjections={127}
        uniqueObjections={7}
        mostFrequent={28}
      />
      <div className="grid grid-cols-1 gap-6">
        <MonthlyObjectionsChart 
          data={objectionsData}
          selectedDate={objectionsDate}
          onDateChange={setObjectionsDate}
          selectedSeller={objectionsSeller}
          onSellerChange={setObjectionsSeller}
          sellers={sellers}
        />
        <ObjectionTrendsChart 
          data={objectionTrendsData}
          selectedDate={objectionsDate}
          onDateChange={setObjectionsDate}
          selectedSeller={objectionsSeller}
          onSellerChange={setObjectionsSeller}
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
