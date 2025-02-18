
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
import { SellerSelector } from "@/components/dashboard/SellerSelector";
import { User } from "@/types/organization";

interface TrendData {
  month: string;
  [key: string]: number | string;
}

interface ObjectionTrendsChartProps {
  data: TrendData[];
  selectedSeller: string;
  onSellerChange: (sellerId: string) => void;
  sellers: User[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border rounded-lg shadow-lg p-4">
        <p className="font-medium mb-2">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.color }}>
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
  selectedSeller,
  onSellerChange,
  sellers
}: ObjectionTrendsChartProps) => {
  const colors = ["#2563eb", "#f97316", "#22c55e", "#8b5cf6", "#ef4444"];
  const topObjections = Object.keys(data[0] || {}).filter(key => key !== "month").slice(0, 5);

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Tendências das Principais Objeções</h3>
          <SellerSelector 
            selectedSeller={selectedSeller}
            onSellerChange={onSellerChange}
            sellers={sellers}
          />
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month"
                angle={-30}
                textAnchor="end"
                height={60}
                interval={0}
              />
              <YAxis />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend />
              {topObjections.map((objection, index) => (
                <Line
                  key={objection}
                  type="monotone"
                  dataKey={objection}
                  name={objection}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
