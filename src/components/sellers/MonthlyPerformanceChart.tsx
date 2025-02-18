
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { PerformanceMetric } from "@/hooks/dashboard/usePerformanceData";

interface MonthlyPerformanceChartProps {
  data: Array<{
    month: string;
    joao: number;
    maria: number;
  }>;
  selectedMetric: PerformanceMetric;
  onMetricChange: (value: PerformanceMetric) => void;
}

const metricLabels: Record<PerformanceMetric, string> = {
  leads: "Leads Cadastrados",
  uploads: "Uploads de Arquivos",
  logins: "Logins no Sistema",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border rounded-lg shadow-lg p-4">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value} {entry.dataKey}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const MonthlyPerformanceChart = ({
  data,
  selectedMetric,
  onMetricChange,
}: MonthlyPerformanceChartProps) => (
  <Card className="p-4">
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Performance Mensal dos Vendedores</h3>
        <Select value={selectedMetric} onValueChange={(value) => onMetricChange(value as PerformanceMetric)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o critério" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="leads">Leads Cadastrados</SelectItem>
            <SelectItem value="uploads">Uploads de Arquivos</SelectItem>
            <SelectItem value="logins">Logins no Sistema</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
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
