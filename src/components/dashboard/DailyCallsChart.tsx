
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

interface DailyCallsChartProps {
  data: any[];
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  isMonthly?: boolean;
  selectedSeller: string;
  onSellerChange: (sellerId: string) => void;
  sellers: User[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border rounded-lg shadow-lg p-4">
        <p className="font-medium">{label}</p>
        {payload.map((item: any) => (
          <p
            key={item.dataKey}
            style={{ color: item.fill }}
            className="capitalize"
          >
            {item.name}: {item.value} uploads
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const DailyCallsChart = ({ 
  data, 
  selectedDate, 
  onDateChange, 
  isMonthly = false,
  selectedSeller,
  onSellerChange,
  sellers 
}: DailyCallsChartProps) => (
  <Card className="p-4">
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {isMonthly ? "Uploads por mês" : "Uploads por dia"}
        </h3>
        <div className="flex items-center gap-4">
          {!isMonthly && selectedDate && onDateChange && (
            <MonthYearSelector
              selectedDate={selectedDate}
              onDateChange={onDateChange}
            />
          )}
          <SellerSelector
            selectedSeller={selectedSeller}
            onSellerChange={onSellerChange}
            sellers={sellers}
          />
        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={isMonthly ? "month" : "day"} />
            <YAxis />
            <RechartsTooltip content={<CustomTooltip />} />
            <Bar dataKey="uploads" name="Uploads" fill="#2563eb" />
            <Bar dataKey="processed" name="Processados" fill="#16a34a" />
            <Bar dataKey="failed" name="Falhas" fill="#dc2626" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </Card>
);
