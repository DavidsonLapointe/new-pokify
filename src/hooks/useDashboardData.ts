
import { useState } from "react";
import { mockDashboardData } from "@/mocks/dashboardMocks";

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
  const [dailyMetric, setDailyMetric] = useState("calls");
  const [monthlyMetric, setMonthlyMetric] = useState("calls");
  const [monthlySuggestionsDate, setMonthlySuggestionsDate] = useState(new Date());
  const [monthlySuggestionsSeller, setMonthlySuggestionsSeller] = useState("all");

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
    dailyPerformanceData: mockDashboardData.dailyPerformanceData,
    monthlyPerformanceData: mockDashboardData.monthlyPerformanceData,
    
    // Dados de objeções
    objectionsData: mockDashboardData.objectionsData,
    objectionTrendsData: mockDashboardData.objectionTrendsData,
    objectionExamples: mockDashboardData.objectionExamples,
    
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
