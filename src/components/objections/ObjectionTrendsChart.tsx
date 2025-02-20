import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
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
  date: string;
  count: number;
}

interface ObjectionTrendsChartProps {
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

export const ObjectionTrendsChart = ({ 
  data, 
  selectedDate, 
  onDateChange, 
  selectedSeller,
  onSellerChange,
  sellers 
}: ObjectionTrendsChartProps) => (
  <Card className="p-4">
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tendências de Objeções</h3>
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
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <RechartsTooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="count" stroke="#2563eb" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </Card>
);
