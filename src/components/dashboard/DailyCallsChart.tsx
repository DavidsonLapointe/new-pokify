
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
import { CustomTooltip } from "./CustomTooltip";

interface DailyCallsChartProps {
  data: any[];
}

export const DailyCallsChart = ({ data }: DailyCallsChartProps) => (
  <Card className="p-6">
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Distribuição Diária de Chamadas</h3>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="processadas" name="Processadas" stackId="a" fill="#22c55e" />
            <Bar dataKey="pendentes" name="Pendentes" stackId="a" fill="#eab308" />
            <Bar dataKey="erro" name="Erro" stackId="a" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </Card>
);
