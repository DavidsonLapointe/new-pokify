
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface AIExecutionData {
  month: string;
  all: number;
  analysis: number;
  transcription: number;
  scoring: number;
  suggestions: number;
}

interface AdminAIExecutionsChartProps {
  data: AIExecutionData[];
  selectedFunction: string;
  isLoading: boolean;
}

export const AdminAIExecutionsChart = ({ 
  data, 
  selectedFunction, 
  isLoading 
}: AdminAIExecutionsChartProps) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-[400px] w-full" />
      </Card>
    );
  }

  // Function to get the proper label based on the selected function
  const getFunctionLabel = (fnName: string) => {
    switch (fnName) {
      case "analysis": return "Análise de Chamadas";
      case "transcription": return "Transcrição";
      case "scoring": return "Pontuação de Leads";
      case "suggestions": return "Sugestões";
      default: return "Todas as funções";
    }
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-purple-600 font-semibold">
            {payload[0].value} execuções
          </p>
          <p className="text-xs text-gray-500">
            {getFunctionLabel(selectedFunction)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Dynamic bar color based on selected function
  const getBarColor = () => {
    switch (selectedFunction) {
      case "analysis": return "#8b5cf6";
      case "transcription": return "#ec4899";
      case "scoring": return "#06b6d4";
      case "suggestions": return "#f59e0b";
      default: return "#9333ea";
    }
  };

  return (
    <Card className="p-6">
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey={selectedFunction} 
              name={getFunctionLabel(selectedFunction)} 
              fill={getBarColor()} 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
