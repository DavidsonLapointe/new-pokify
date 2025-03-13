
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

interface ObjectionData {
  name: string;
  value: number;
  count: number;
}

interface MonthlyObjectionsChartProps {
  data: ObjectionData[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
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
          Ocorrências: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export const MonthlyObjectionsChart = ({ 
  data, 
  selectedDate, 
  onDateChange, 
  selectedSeller,
  onSellerChange,
  sellers 
}: MonthlyObjectionsChartProps) => (
  <Card className="p-4">
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Principais Objeções do Período</h3>
        <div className="flex items-center gap-4">
          <MonthYearSelector selectedDate={selectedDate} onDateChange={onDateChange} />
          <SellerSelector 
            selectedSeller={selectedSeller}
            onSellerChange={onSellerChange}
            sellers={sellers}
          />
        </div>
      </div>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data || []} 
            margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis 
              dataKey="name" 
              type="category"
              width={250}
              tick={{ fontSize: 13 }}
            />
            <RechartsTooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey="value" name="Ocorrências" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </Card>
);
