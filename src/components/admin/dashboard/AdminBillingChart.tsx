
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

interface BillingData {
  month: string;
  amount: number;
  plansAmount?: number;
  setupAmount?: number;
}

interface AdminBillingChartProps {
  data: BillingData[];
  isLoading: boolean;
}

export const AdminBillingChart = ({ data, isLoading }: AdminBillingChartProps) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-[400px] w-full" />
      </Card>
    );
  }

  // Format currency for tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const totalAmount = payload[0].value;
      const plansAmount = payload[0].payload.plansAmount || 0;
      const setupAmount = payload[0].payload.setupAmount || 0;

      return (
        <div className="bg-white p-4 border rounded shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600 font-semibold">
            Faturamento Total: {formatCurrency(totalAmount)}
          </p>
          <p className="text-blue-500">
            Planos: {formatCurrency(plansAmount)}
          </p>
          <p className="text-blue-500">
            Setup: {formatCurrency(setupAmount)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Traduz nomes de mês do inglês para português
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
    month: translateMonth(item.month),
    // Define valores padrão para plansAmount e setupAmount se não existirem
    plansAmount: item.plansAmount || Math.floor(item.amount * 0.7),
    setupAmount: item.setupAmount || Math.floor(item.amount * 0.3)
  }));

  return (
    <Card className="p-6">
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={translatedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            barCategoryGap={10}
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
              tickFormatter={(value) => formatCurrency(value)}
              tick={{ fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Legend />
            <Bar 
              dataKey="amount" 
              name="Faturamento" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
