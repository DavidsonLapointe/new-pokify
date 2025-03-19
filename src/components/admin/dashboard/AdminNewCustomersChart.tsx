
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

interface CustomerData {
  month: string;
  count: number;
}

interface AdminNewCustomersChartProps {
  data: CustomerData[];
  isLoading: boolean;
}

export const AdminNewCustomersChart = ({ data, isLoading }: AdminNewCustomersChartProps) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-[400px] w-full" />
      </Card>
    );
  }

  // Format tooltip messages and translate months
  const translateMonth = (month: string) => {
    const [monthAbbr, year] = month.split('/');
    
    const monthTranslations: Record<string, string> = {
      'Jan': 'Jan',
      'Feb': 'Fev',
      'Mar': 'Mar',
      'Apr': 'Abr',
      'May': 'Mai',
      'Jun': 'Jun',
      'Jul': 'Jul',
      'Aug': 'Ago',
      'Sep': 'Set',
      'Oct': 'Out',
      'Nov': 'Nov',
      'Dec': 'Dez'
    };
    
    return `${monthTranslations[monthAbbr] || monthAbbr}/${year}`;
  };

  // Traduz os meses nos dados
  const translatedData = data.map(item => ({
    ...item,
    month: translateMonth(item.month)
  }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600 font-semibold">
            {payload[0].value} {payload[0].value === 1 ? 'novo cliente' : 'novos clientes'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={translatedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              angle={-45}
              textAnchor="end"
              height={70}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              allowDecimals={false} 
              tick={{ fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Legend />
            <Bar 
              dataKey="count" 
              name="Novos Clientes" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
