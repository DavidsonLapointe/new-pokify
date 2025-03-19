
import { useState, useEffect, useMemo } from 'react';
import { MonthStats } from '@/types/calls';
import { useLeadsData } from './dashboard/useLeadsData';
import { useCallsData } from './dashboard/useCallsData';
import { usePerformanceData } from './dashboard/usePerformanceData';
import { useSuggestionsData } from './dashboard/useSuggestionsData';
import { useObjectionsData } from './dashboard/useObjectionsData';

interface DashboardData {
  callsStats: MonthStats;
  leadsStats: {
    total: number;
    active: number;
    pending: number;
  };
  leadsByDay: {
    day: string;
    leads: number;
    novos?: number;
  }[];
  conversionStats: {
    total: number;
    converted: number;
    rate: number;
  };
  objections: {
    name: string;
    count: number;
  }[];
  suggestions: {
    name: string;
    count: number;
  }[];
}

// Mock data for dashboard stats
export const mockDashboardStats: DashboardData = {
  callsStats: {
    total: 150,
    active: 120,
    pending: 20,
    processed: 100,
    failed: 10,
    novos: 5
  },
  leadsStats: {
    total: 85,
    active: 65,
    pending: 20
  },
  leadsByDay: [
    { day: '01', leads: 5, novos: 2 },
    { day: '02', leads: 7, novos: 3 },
    { day: '03', leads: 4, novos: 1 },
    { day: '04', leads: 8, novos: 4 },
    { day: '05', leads: 10, novos: 5 },
    { day: '06', leads: 6, novos: 2 },
    { day: '07', leads: 9, novos: 4 }
  ],
  conversionStats: {
    total: 85,
    converted: 25,
    rate: 29
  },
  objections: [
    { name: 'Preço alto', count: 15 },
    { name: 'Falta de recursos', count: 12 },
    { name: 'Já utiliza concorrente', count: 10 },
    { name: 'Sem orçamento', count: 8 },
    { name: 'Timing inadequado', count: 7 }
  ],
  suggestions: [
    { name: 'Destacar economia', count: 18 },
    { name: 'Oferecer demo', count: 15 },
    { name: 'Mostrar ROI', count: 12 },
    { name: 'Contato de follow-up', count: 10 },
    { name: 'Personalizar proposta', count: 8 }
  ]
};

export const useDashboardData = () => {
  // Get data from specialized hooks
  const {
    dailyLeadsData,
    monthlyLeadsData,
    monthlyLeadsDate,
    setMonthlyLeadsDate,
    dailyLeadsDate,
    setDailyLeadsDate,
    monthlyLeadsSeller,
    setMonthlyLeadsSeller,
    dailyLeadsSeller,
    setDailyLeadsSeller
  } = useLeadsData();

  const {
    dailyCallsData,
    monthlyCallsData,
    callsDate,
    setCallsDate,
    monthlyCallsSeller,
    setMonthlyCallsSeller,
    dailyCallsSeller,
    setDailyCallsSeller,
  } = useCallsData();

  const {
    dailyPerformanceData,
    monthlyPerformanceData,
    performanceDate,
    setPerformanceDate,
    dailyMetric,
    setDailyMetric,
    monthlyMetric,
    setMonthlyMetric,
  } = usePerformanceData();

  const {
    objectionsData,
    objectionTrendsData,
    objectionExamples,
    monthlyObjectionsDate,
    setMonthlyObjectionsDate,
    monthlyObjectionsSeller,
    setMonthlyObjectionsSeller,
    objectionTrendsSeller,
    setObjectionTrendsSeller
  } = useObjectionsData();

  const {
    suggestionsData,
    monthlySuggestionsDate,
    setMonthlySuggestionsDate,
    monthlySuggestionsSeller,
    setMonthlySuggestionsSeller,
    updateSuggestionStatus
  } = useSuggestionsData();

  // Mock data for dashboard stats
  const [data, setData] = useState<DashboardData>(mockDashboardStats);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });

  // Generate mock sellers
  const sellers = useMemo(() => [
    { id: 'all', name: 'Todos' },
    { id: 'joao', name: 'João Silva' },
    { id: 'maria', name: 'Maria Santos' }
  ], []);

  // Mock month stats
  const monthStats: MonthStats = {
    total: 150,
    active: 120,
    pending: 20,
    processed: 100,
    failed: 10,
    novos: 5
  };

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [dateRange]);

  return {
    data,
    isLoading,
    dateRange,
    setDateRange,
    // Return all the specialized data
    monthStats,
    dailyLeadsData,
    monthlyLeadsData,
    dailyCallsData,
    monthlyCallsData,
    dailyPerformanceData,
    monthlyPerformanceData,
    monthlyLeadsDate,
    setMonthlyLeadsDate,
    dailyLeadsDate,
    setDailyLeadsDate,
    callsDate,
    setCallsDate,
    performanceDate,
    monthlyCallsSeller,
    setMonthlyCallsSeller,
    dailyCallsSeller,
    setDailyCallsSeller,
    monthlyLeadsSeller,
    setMonthlyLeadsSeller,
    dailyLeadsSeller,
    setDailyLeadsSeller,
    dailyMetric,
    setDailyMetric,
    monthlyMetric,
    setMonthlyMetric,
    sellers,
    // Objections data
    objectionsData,
    objectionTrendsData,
    objectionExamples,
    monthlyObjectionsDate,
    setMonthlyObjectionsDate,
    monthlyObjectionsSeller,
    setMonthlyObjectionsSeller,
    objectionTrendsSeller,
    setObjectionTrendsSeller,
    // Suggestions data
    suggestionsData,
    monthlySuggestionsDate,
    setMonthlySuggestionsDate,
    monthlySuggestionsSeller,
    setMonthlySuggestionsSeller,
    updateSuggestionStatus
  };
};
