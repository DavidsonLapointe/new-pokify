
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DailyPerformanceChartProps {
  data: any[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border rounded-lg shadow-lg p-4">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value} leads
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const DailyPerformanceChart = ({ data }: DailyPerformanceChartProps) => (
  <Card className="p-4">
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Performance Diária dos Vendedores</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="joao"
              name="João Silva"
              stroke="#2563eb"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="maria"
              name="Maria Santos"
              stroke="#16a34a"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </Card>
);
