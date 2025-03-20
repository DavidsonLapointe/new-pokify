
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface CustomerSuccessMetricsChartProps {
  metricType: "active-companies" | "active-users" | "ai-executions" | "ai-tools-per-client";
}

// Generate last 12 months for X-axis
const generateLastMonths = (count: number) => {
  const months = [];
  const today = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const date = subMonths(today, i);
    const month = format(date, "MMM/yy", { locale: ptBR });
    months.push(format(date, "MMM/yy", { locale: ptBR }));
  }
  
  return months;
};

const MONTHS = generateLastMonths(12);

// Generate mock data based on metric type
const generateMockData = (metricType: string) => {
  const mockData = MONTHS.map((month, index) => {
    const baseValue = 30 + Math.floor(Math.random() * 50);
    
    switch (metricType) {
      case "active-companies":
        // Gradually increasing companies (28-78)
        return {
          month,
          value: 28 + index * 5 + Math.floor(Math.random() * 8)
        };
      
      case "active-users":
        // Growing user base (150-420)
        return {
          month,
          value: 150 + index * 25 + Math.floor(Math.random() * 20)
        };
      
      case "ai-executions":
        // AI executions with larger random variations (500-2000)
        return {
          month,
          value: 500 + index * 120 + Math.floor(Math.random() * 200)
        };
      
      case "ai-tools-per-client":
        // Average AI tools per client (1.2-2.5)
        const value = (1.2 + index * 0.1 + Math.random() * 0.2).toFixed(1);
        return {
          month,
          value: parseFloat(value)
        };
      
      default:
        return { month, value: baseValue };
    }
  });
  
  return mockData;
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-sm">
        <p className="font-medium">{label}</p>
        <p className="text-blue-600 font-semibold">
          {typeof payload[0].value === 'number' && 
           Number.isInteger(payload[0].value) ? 
           payload[0].value.toLocaleString('pt-BR') : 
           payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export const CustomerSuccessMetricsChart = ({ metricType }: CustomerSuccessMetricsChartProps) => {
  const [data, setData] = useState<Array<{ month: string; value: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get the Y-axis label based on metric type
  const getYAxisLabel = () => {
    switch (metricType) {
      case "active-companies":
        return "Empresas";
      case "active-users":
        return "Usuários";
      case "ai-executions":
        return "Execuções";
      case "ai-tools-per-client":
        return "Média por cliente";
      default:
        return "";
    }
  };

  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const generatedData = generateMockData(metricType);
      setData(generatedData);
      setIsLoading(false);
    }, 800);
  }, [metricType]);

  // Choose chart type based on metric
  const renderChart = () => {
    if (metricType === "ai-tools-per-client") {
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            domain={[0, 'auto']}
            tick={{ fontSize: 12 }}
            label={{ 
              value: getYAxisLabel(), 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            name="Média de ferramentas"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      );
    }
    
    return (
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          label={{ 
            value: getYAxisLabel(), 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle' }
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar 
          dataKey="value" 
          name={getYAxisLabel()}
          fill="#3b82f6" 
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    );
  };

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Skeleton className="h-[350px] w-full" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      )}
    </>
  );
};
