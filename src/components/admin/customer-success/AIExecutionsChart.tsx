
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

interface AIExecutionData {
  month: string;
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

  useEffect(() => {
    const fetchExecutionsData = async () => {
      if (!organizationId) return;
      
      setIsLoading(true);
      try {
        // Buscar dados de execuções de AI da organização
        const { data: analyses, error } = await supabase
          .from('organization_lead_analyses')
          .select('created_at, analysis_type, status')
          .eq('lead_id', supabase.rpc('get_leads_by_organization', { org_id: organizationId }))
          .order('created_at');

        if (error) throw error;

        // Processar dados para o gráfico
        // Este é um exemplo simplificado, você precisará ajustar conforme sua estrutura de dados
        const last6Months = getLastMonths(6);
        const chartData = last6Months.map(month => {
          const monthData = {
            month,
            all: 0,
            analysis: 0,
            transcription: 0,
            scoring: 0,
            suggestions: 0
          };

          // Preencher com dados reais se disponíveis
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
      } catch (error) {
        console.error("Erro ao carregar dados de execuções:", error);
        toast.error("Erro ao carregar dados de execuções de IA");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExecutionsData();
  }, [organizationId]);

  // Helper para obter últimos N meses no formato "Jan/23"
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

  // Função para obter label adequado com base na função selecionada
  const getFunctionLabel = (fnName: string) => {
    switch (fnName) {
      case "analysis": return "Análise de Chamadas";
      case "transcription": return "Transcrição";
      case "scoring": return "Pontuação de Leads";
      case "suggestions": return "Sugestões";
      default: return "Todas as funções";
    }
  };

  // Traduz meses do inglês para português
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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Execuções de IA</CardTitle>
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
