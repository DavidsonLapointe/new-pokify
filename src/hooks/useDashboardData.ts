
import { useState } from "react";
import { mockDashboardData } from "@/mocks/dashboardMocks";
import { DailyPerformanceData, MonthlyPerformanceData, PerformanceMetric } from "@/hooks/dashboard/usePerformanceData";

export const useDashboardData = () => {
  // Estados para gerenciar as seleções de data e filtros
  const [monthlyLeadsDate, setMonthlyLeadsDate] = useState(new Date());
  const [dailyLeadsDate, setDailyLeadsDate] = useState(new Date());
  const [monthlyObjectionsDate, setMonthlyObjectionsDate] = useState(new Date());
  const [callsDate, setCallsDate] = useState(new Date());
  const [performanceDate] = useState(new Date());
  const [monthlyCallsSeller, setMonthlyCallsSeller] = useState("all");
  const [dailyCallsSeller, setDailyCallsSeller] = useState("all");
  const [monthlyLeadsSeller, setMonthlyLeadsSeller] = useState("all");
  const [dailyLeadsSeller, setDailyLeadsSeller] = useState("all");
  const [monthlyObjectionsSeller, setMonthlyObjectionsSeller] = useState("all");
  const [objectionTrendsSeller, setObjectionTrendsSeller] = useState("all");
  const [dailyMetric, setDailyMetric] = useState<PerformanceMetric>('joao');
  const [monthlyMetric, setMonthlyMetric] = useState<PerformanceMetric>('joao');
  const [monthlySuggestionsDate, setMonthlySuggestionsDate] = useState(new Date());
  const [monthlySuggestionsSeller, setMonthlySuggestionsSeller] = useState("all");

  // Make sure objectionExamples has fallback values
  const ensuredObjectionExamples = {
    'Preço muito alto': ['O valor está acima do nosso orçamento neste momento.', 'Encontramos opções mais acessíveis.'],
    'Concorrente melhor': ['Já estamos em negociação com outro fornecedor que oferece mais recursos.', 'O concorrente oferece condições melhores.'],
    'Sem orçamento': ['Não temos verba disponível para este tipo de investimento agora.', 'Precisamos esperar o próximo ciclo orçamentário.'],
    'Não tenho orçamento no momento': ['Não temos recurso financeiro no momento para este investimento.', 'Nosso orçamento já foi comprometido para este trimestre.'],
    'Não é prioridade': ['No momento estamos focados em outros projetos mais urgentes.', 'Esta solução não está entre nossas prioridades atuais.'],
    'Já tem solução': ['Já contratamos uma ferramenta semelhante recentemente.', 'Já temos uma solução implementada.'],
    ...mockDashboardData.objectionExamples,
  };

  // Ensure the performance data is correctly typed
  const typedDailyPerformanceData: DailyPerformanceData[] = 
    (mockDashboardData.dailyPerformanceData || []).map(item => ({
      day: item.day || '',
      joao: typeof item.joao === 'number' ? item.joao : 0,
      maria: typeof item.maria === 'number' ? item.maria : 0
    }));

  const typedMonthlyPerformanceData: MonthlyPerformanceData[] = 
    (mockDashboardData.monthlyPerformanceData || []).map(item => ({
      month: item.month || '',
      joao: typeof item.joao === 'number' ? item.joao : 0,
      maria: typeof item.maria === 'number' ? item.maria : 0
    }));

  // Retornamos os dados mockados e os estados de filtro
  return {
    // Estatísticas do mês
    monthStats: mockDashboardData.monthStats,
    
    // Dados de leads
    dailyLeadsData: mockDashboardData.dailyLeadsData,
    monthlyLeadsData: mockDashboardData.monthlyLeadsData,
    
    // Dados de chamadas
    dailyCallsData: mockDashboardData.dailyCallsData,
    monthlyCallsData: mockDashboardData.monthlyCallsData,
    
    // Dados de desempenho
    dailyPerformanceData: typedDailyPerformanceData,
    monthlyPerformanceData: typedMonthlyPerformanceData,
    
    // Dados de objeções
    objectionsData: mockDashboardData.objectionsData || [],
    objectionTrendsData: mockDashboardData.objectionTrendsData || [],
    objectionExamples: ensuredObjectionExamples,
    
    // Dados de sugestões
    suggestionsData: mockDashboardData.suggestionsData,
    
    // Estados de seleção de datas
    monthlyLeadsDate,
    setMonthlyLeadsDate,
    dailyLeadsDate,
    setDailyLeadsDate,
    monthlyObjectionsDate,
    setMonthlyObjectionsDate,
    callsDate,
    setCallsDate,
    performanceDate,
    
    // Estados de seleção de vendedores
    monthlyCallsSeller,
    setMonthlyCallsSeller,
    dailyCallsSeller,
    setDailyCallsSeller,
    monthlyLeadsSeller,
    setMonthlyLeadsSeller,
    dailyLeadsSeller,
    setDailyLeadsSeller,
    monthlyObjectionsSeller,
    setMonthlyObjectionsSeller,
    objectionTrendsSeller,
    setObjectionTrendsSeller,
    
    // Estados de seleção de métricas
    dailyMetric,
    setDailyMetric,
    monthlyMetric,
    setMonthlyMetric,
    
    // Estados para sugestões
    monthlySuggestionsDate,
    setMonthlySuggestionsDate,
    monthlySuggestionsSeller,
    setMonthlySuggestionsSeller,
  };
};
