
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DailyLeadsChartProps {
  data: any[];
}

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

export const DailyLeadsChart = ({ data }: DailyLeadsChartProps) => (
  <Card className="p-4">
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Distribuição Diária de Leads</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="ativos" name="Ativos" fill="#22c55e" />
            <Bar dataKey="contatados" name="Contatados" fill="#eab308" />
            <Bar dataKey="perdidos" name="Perdidos" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </Card>
);
