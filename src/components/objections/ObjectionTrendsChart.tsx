
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { MonthYearSelector } from "@/components/dashboard/MonthYearSelector";
import { SellerSelector } from "@/components/dashboard/SellerSelector";
import { User } from "@/types";

interface ObjectionData {
  month: string;
  [key: string]: string | number;
}

interface ObjectionTrendsChartProps {
  data: ObjectionData[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  selectedSeller: string;
  onSellerChange: (sellerId: string) => void;
  sellers: User[];
}

const COLORS = ["#2563eb", "#16a34a", "#dc2626"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border rounded-lg shadow-lg p-4">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
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
}: ObjectionTrendsChartProps) => {
  // Ensure data exists and has at least one item before accessing
  const objectionTypes = data && data.length > 0 
    ? Object.keys(data[0] || {}).filter(key => key !== 'month') 
    : [];

  return (
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
            <LineChart data={data || []} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend />
              {objectionTypes.map((type, index) => (
                <Line
                  key={type}
                  type="monotone"
                  dataKey={type}
                  name={type}
                  stroke={COLORS[index % COLORS.length]}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
