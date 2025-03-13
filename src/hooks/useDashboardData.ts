
import { useState } from "react";
import { mockDashboardData } from "@/mocks/dashboardMocks";
import { DailyPerformanceData, MonthlyPerformanceData, PerformanceMetric } from "@/hooks/dashboard/usePerformanceData";
import { mockOrganizations } from "@/mocks/organizationMocks";
import { addMonths, format } from "date-fns";
import { useSuggestionsData } from "./dashboard/useSuggestionsData";
import { useObjectionsData } from "./dashboard/useObjectionsData";

export const useDashboardData = () => {
  // Define current date (for initializing default date selections)
  const currentDate = new Date();
  
  // Estados para gerenciar as seleções de data e filtros
  const [monthlyLeadsDate, setMonthlyLeadsDate] = useState(currentDate);
  const [dailyLeadsDate, setDailyLeadsDate] = useState(currentDate);
  const [callsDate, setCallsDate] = useState(new Date());
  const [performanceDate] = useState(new Date());
  const [monthlyCallsSeller, setMonthlyCallsSeller] = useState("all");
  const [dailyCallsSeller, setDailyCallsSeller] = useState("all");
  const [monthlyLeadsSeller, setMonthlyLeadsSeller] = useState("all");
  const [dailyLeadsSeller, setDailyLeadsSeller] = useState("all");
  const [dailyMetric, setDailyMetric] = useState<PerformanceMetric>('joao');
  const [monthlyMetric, setMonthlyMetric] = useState<PerformanceMetric>('joao');

  // Get objections data
  const objections = useObjectionsData();
  
  // Get suggestions data
  const suggestions = useSuggestionsData();

  // Get ALL sellers from the first organization, regardless of status
  const sellers = mockOrganizations[0]?.users || [];

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
    
  // Add February 2025 data to dailyLeadsData
  const enhancedDailyLeadsData = [...mockDashboardData.dailyLeadsData];
  
  // Create mock data for February 2025
  const feb2025 = addMonths(new Date(2025, 0, 1), 1); // February 2025
  
  // Add days for February 2025
  for (let i = 1; i <= 28; i++) {
    enhancedDailyLeadsData.push({
      day: `${i.toString().padStart(2, '0')}/02`,
      novos: Math.floor(Math.random() * 15) + 5
    });
  }

  // Retornamos os dados mockados e os estados de filtro
  return {
    // Estatísticas do mês
    monthStats: mockDashboardData.monthStats,
    
    // Dados de leads
    dailyLeadsData: enhancedDailyLeadsData,
    monthlyLeadsData: mockDashboardData.monthlyLeadsData,
    
    // Dados de chamadas
    dailyCallsData: mockDashboardData.dailyCallsData,
    monthlyCallsData: mockDashboardData.monthlyCallsData,
    
    // Dados de desempenho
    dailyPerformanceData: typedDailyPerformanceData,
    monthlyPerformanceData: typedMonthlyPerformanceData,
    
    // Dados de objeções
    ...objections,
    
    // Dados de sugestões
    ...suggestions,
    
    // Lista de vendedores
    sellers,
    
    // Estados de seleção de datas
    monthlyLeadsDate,
    setMonthlyLeadsDate,
    dailyLeadsDate,
    setDailyLeadsDate,
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
    
    // Estados de seleção de métricas
    dailyMetric,
    setDailyMetric,
    monthlyMetric,
    setMonthlyMetric,
  };
};
