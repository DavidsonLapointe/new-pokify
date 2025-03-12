
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { MonthYearSelector } from "@/components/dashboard/MonthYearSelector";
import { SellerSelector } from "@/components/dashboard/SellerSelector";
import { User } from "@/types";
import { useMemo } from "react";

interface DailyLeadsChartProps {
  data: any[];
  onDateChange: (date: Date) => void;
  selectedDate: Date;
  selectedSeller: string;
  onSellerChange: (sellerId: string) => void;
  sellers: User[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border rounded-lg shadow-lg p-4">
        <p className="font-medium">{label}</p>
        <p className="text-primary">
          Novos Leads: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export const DailyLeadsChart = ({ 
  data, 
  onDateChange, 
  selectedDate,
  selectedSeller,
  onSellerChange,
  sellers
}: DailyLeadsChartProps) => {
  // Filter data based on selected seller
  const filteredData = useMemo(() => {
    if (selectedSeller === "all") {
      return data; // Return all data
    } else {
      // Return data for the specific seller if available
      // This is a mock implementation since we don't have real seller-specific data
      // In a real implementation, you'd filter based on actual seller data
      return data.map(item => ({
        ...item,
        novos: Math.floor(item.novos * (Math.random() * 0.5 + 0.2)) // Mock data for seller
      }));
    }
  }, [data, selectedSeller]);

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Cadastro de novos leads por dia</h3>
          <div className="flex items-center gap-4">
            <MonthYearSelector
              selectedDate={selectedDate}
              onDateChange={onDateChange}
            />
            <SellerSelector 
              selectedSeller={selectedSeller}
              onSellerChange={onSellerChange}
              sellers={sellers}
            />
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="day" 
                angle={-30}
                textAnchor="end"
                height={40}
                interval={0}
                tick={{ fontSize: 13 }}
              />
              <YAxis />
              <RechartsTooltip content={<CustomTooltip />} />
              <Bar dataKey="novos" name="Novos Leads" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
