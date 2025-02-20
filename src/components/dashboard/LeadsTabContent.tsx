import { LeadsStats } from "@/components/leads/LeadsStats";
import { DailyLeadsChart } from "@/components/leads/DailyLeadsChart";
import { MonthlyLeadsChart } from "@/components/leads/MonthlyLeadsChart";
import { User } from "@/types";

interface LeadsTabContentProps {
  leadsStats: {
    total: number;
    active: number;
    pending: number;
  };
  monthlyLeadsData: any[];
  dailyLeadsData: any[];
  monthlyLeadsDate: Date;
  setMonthlyLeadsDate: (date: Date) => void;
  dailyLeadsDate: Date;
  setDailyLeadsDate: (date: Date) => void;
  monthlyLeadsSeller: string;
  setMonthlyLeadsSeller: (seller: string) => void;
  dailyLeadsSeller: string;
  setDailyLeadsSeller: (seller: string) => void;
  sellers: User[];
}

export const LeadsTabContent = ({
  leadsStats,
  monthlyLeadsData,
  dailyLeadsData,
  monthlyLeadsDate,
  setMonthlyLeadsDate,
  dailyLeadsDate,
  setDailyLeadsDate,
  monthlyLeadsSeller,
  setMonthlyLeadsSeller,
  dailyLeadsSeller,
  setDailyLeadsSeller,
  sellers,
}: LeadsTabContentProps) => {
  return (
    <div className="space-y-6">
      <LeadsStats
        total={leadsStats.total}
        active={leadsStats.active}
        pending={leadsStats.pending}
      />
      <div className="space-y-6">
        <MonthlyLeadsChart 
          data={monthlyLeadsData}
          selectedDate={monthlyLeadsDate}
          onDateChange={setMonthlyLeadsDate}
          selectedSeller={monthlyLeadsSeller}
          onSellerChange={setMonthlyLeadsSeller}
          sellers={sellers}
        />
        <DailyLeadsChart 
          data={dailyLeadsData}
          selectedDate={dailyLeadsDate}
          onDateChange={setDailyLeadsDate}
          selectedSeller={dailyLeadsSeller}
          onSellerChange={setDailyLeadsSeller}
          sellers={sellers}
        />
      </div>
    </div>
  );
};
