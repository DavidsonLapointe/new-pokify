
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonthYearSelector } from "@/components/dashboard/MonthYearSelector";

// Update the interface to make month optional when day is present
interface AIExecutionData {
  month?: string;
  day?: string;
  all: number;
  analysis: number;
  transcription: number;
  scoring: number;
  suggestions: number;
}

interface AIExecutionsChartProps {
  organizationId: string;
}

export const AIExecutionsChart = ({ organizationId }: AIExecutionsChartProps) => {
  const [data, setData] = useState<AIExecutionData[]>([]);
  const [selectedFunction, setSelectedFunction] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"monthly" | "daily">("monthly");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [availableMonths, setAvailableMonths] = useState<Array<{ date: string; amount: number }>>([]);

  useEffect(() => {
    const fetchExecutionsData = async () => {
      if (!organizationId) return;
      
      setIsLoading(true);
      try {
        // Buscar dados de execuções de AI da organização
        const { data: analyses, error } = await supabase
          .from('organization_lead_analyses')
          .select('created_at, analysis_type, status')
          .eq('lead_id', organizationId)
          .order('created_at');

        if (error) throw error;

        // Generate data for available months that have AI executions
        if (analyses && analyses.length > 0) {
          const monthCounts = new Map<string, number>();
          
          analyses.forEach(analysis => {
            const analysisDate = new Date(analysis.created_at);
            const dateKey = analysisDate.toISOString().substring(0, 10); // YYYY-MM-DD format
            
            // Count by month for the MonthYearSelector
            const monthKey = dateKey.substring(0, 7); // YYYY-MM format
            const currentCount = monthCounts.get(monthKey) || 0;
            monthCounts.set(monthKey, currentCount + 1);
          });
          
          // Convert to array for MonthYearSelector
          const monthsWithData = Array.from(monthCounts.entries()).map(([date, amount]) => ({
            date, 
            amount
          }));
          
          setAvailableMonths(monthsWithData);
        }
        
        // Process data based on view mode
        if (viewMode === "monthly") {
          const last13Months = getLastMonths(13);
          const chartData = last13Months.map(month => {
            const monthData: AIExecutionData = {
              month,
              all: 0,
              analysis: 0,
              transcription: 0,
              scoring: 0,
              suggestions: 0
            };

            // Fill with real data if available
            if (analyses && analyses.length > 0) {
              const [monthAbbr, year] = month.split('/');
              analyses.forEach(analysis => {
                const analysisDate = new Date(analysis.created_at);
                const analysisMonth = analysisDate.toLocaleString('en-US', { month: 'short' });
                const analysisYear = analysisDate.getFullYear().toString().substr(2, 2);
                
                if (`${analysisMonth}/${analysisYear}` === month) {
                  monthData.all += 1;
                  if (analysis.analysis_type === 'analysis') monthData.analysis += 1;
                  if (analysis.analysis_type === 'transcription') monthData.transcription += 1;
                  if (analysis.analysis_type === 'scoring') monthData.scoring += 1;
                  if (analysis.analysis_type === 'suggestions') monthData.suggestions += 1;
                }
              });
            }
            
            return monthData;
          });

          setData(chartData);
        } else {
          // Daily view - filter by selected month
          if (!selectedDate) {
            setData([]);
            setIsLoading(false);
            return;
          }

          const daysInMonth = getDaysInMonth(selectedDate);
          const chartData = daysInMonth.map(day => {
            // Ensure the daily data conforms to AIExecutionData by including all required properties
            const dayData: AIExecutionData = {
              day,
              all: 0,
              analysis: 0,
              transcription: 0,
              scoring: 0,
              suggestions: 0
            };

            // Fill with real data if available
            if (analyses && analyses.length > 0) {
              analyses.forEach(analysis => {
                const analysisDate = new Date(analysis.created_at);
                const formattedDay = analysisDate.getDate().toString().padStart(2, '0');
                const formattedMonth = (analysisDate.getMonth() + 1).toString().padStart(2, '0');
                const fullDay = `${formattedDay}/${formattedMonth}`;
                
                if (fullDay === day && 
                    analysisDate.getMonth() === selectedDate.getMonth() && 
                    analysisDate.getFullYear() === selectedDate.getFullYear()) {
                  dayData.all += 1;
                  if (analysis.analysis_type === 'analysis') dayData.analysis += 1;
                  if (analysis.analysis_type === 'transcription') dayData.transcription += 1;
                  if (analysis.analysis_type === 'scoring') dayData.scoring += 1;
                  if (analysis.analysis_type === 'suggestions') dayData.suggestions += 1;
                }
              });
            }
            
            return dayData;
          });

          setData(chartData);
        }
      } catch (error) {
        console.error("Erro ao carregar dados de execuções:", error);
        toast.error("Erro ao carregar dados de execuções de IA");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExecutionsData();
  }, [organizationId, viewMode, selectedDate]);

  // Helper to get last N months in format "Jan/23"
  const getLastMonths = (n: number) => {
    const months = [];
    const date = new Date();
    for (let i = 0; i < n; i++) {
      const month = date.toLocaleString('en-US', { month: 'short' });
      const year = date.getFullYear().toString().substr(2, 2);
      months.unshift(`${month}/${year}`);
      date.setMonth(date.getMonth() - 1);
    }
    return months;
  };

  // Helper to get all days in the selected month in format "DD/MM"
  const getDaysInMonth = (date: Date) => {
    const days = [];
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let i = 1; i <= daysInMonth; i++) {
      const formattedDay = i.toString().padStart(2, '0');
      const formattedMonth = (month + 1).toString().padStart(2, '0');
      days.push(`${formattedDay}/${formattedMonth}`);
    }
    
    return days;
  };

  // Function to get appropriate label based on selected function
  const getFunctionLabel = (fnName: string) => {
    switch (fnName) {
      case "analysis": return "Análise de Chamadas";
      case "transcription": return "Transcrição";
      case "scoring": return "Pontuação de Leads";
      case "suggestions": return "Sugestões";
      default: return "Todas as funções";
    }
  };

  // Translate months from English to Portuguese
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

  // Translate days in the data
  const getTranslatedData = () => {
    if (viewMode === "monthly") {
      return data.map(item => ({
        ...item,
        month: item.month ? translateMonth(item.month) : undefined
      }));
    } else {
      return data;
    }
  };

  const translatedData = getTranslatedData();

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600 font-semibold">
            {payload[0].value} {payload[0].value === 1 ? 'execução' : 'execuções'}
          </p>
          <p className="text-xs text-gray-500">
            {getFunctionLabel(selectedFunction)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-col space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Execuções de IA</CardTitle>
          <Tabs 
            value={viewMode} 
            onValueChange={(value) => setViewMode(value as "monthly" | "daily")}
            className="mt-2 sm:mt-0"
          >
            <TabsList>
              <TabsTrigger value="monthly">Mensal</TabsTrigger>
              <TabsTrigger value="daily">Diário</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 justify-between">
          <div className="flex flex-row items-center gap-2">
            {viewMode === "daily" && (
              <div className="w-[180px]">
                <MonthYearSelector
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  showAllOption={false}
                  billingData={availableMonths}
                />
              </div>
            )}
            <Select
              value={selectedFunction}
              onValueChange={setSelectedFunction}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Selecionar função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as funções</SelectItem>
                <SelectItem value="analysis">Análise de Chamadas</SelectItem>
                <SelectItem value="transcription">Transcrição</SelectItem>
                <SelectItem value="scoring">Pontuação de Leads</SelectItem>
                <SelectItem value="suggestions">Sugestões</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={translatedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey={viewMode === "monthly" ? "month" : "day"} 
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
                  dataKey={selectedFunction} 
                  name={getFunctionLabel(selectedFunction)} 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
