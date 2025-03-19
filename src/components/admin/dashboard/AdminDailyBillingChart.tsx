
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
import { format, isValid, parseISO, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DailyBillingData {
  date: string;
  amount: number;
  plansAmount: number;
  setupAmount: number;
}

interface AdminDailyBillingChartProps {
  data: DailyBillingData[];
  selectedDate: Date | null;
  isLoading: boolean;
}

export const AdminDailyBillingChart = ({ 
  data, 
  selectedDate,
  isLoading 
}: AdminDailyBillingChartProps) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-[400px] w-full" />
      </Card>
    );
  }

  // Filter data by selected month if a date is selected
  const filteredData = selectedDate 
    ? data.filter(item => {
        const itemDate = parseISO(item.date);
        if (!isValid(itemDate) || !isValid(selectedDate)) return false;
        
        const monthStart = startOfMonth(selectedDate);
        const monthEnd = endOfMonth(selectedDate);
        
        return isWithinInterval(itemDate, { start: monthStart, end: monthEnd });
      })
    : data;

  // Format dates to show only day
  const formattedData = filteredData.map(item => {
    const date = parseISO(item.date);
    return {
      ...item,
      formattedDate: isValid(date) ? format(date, "dd/MM/yyyy") : item.date
    };
  });

  // Custom tooltip component with Portuguese labels
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600 font-semibold">
            Total: R$ {Number(payload[0].value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-blue-600">
            Planos: R$ {Number(payload[0].payload.plansAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-blue-600">
            Setup: R$ {Number(payload[0].payload.setupAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
            data={formattedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="formattedDate" 
              angle={-45}
              textAnchor="end"
              height={70}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
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
