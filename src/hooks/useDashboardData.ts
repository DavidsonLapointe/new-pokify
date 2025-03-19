
import { useState, useEffect } from 'react';
import { format, subMonths, subDays, parseISO } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

// Types for the admin dashboard data
export interface AdminDashboardData {
  activeOrganizations: number;
  pendingSetups: number;
  inactiveUsers: number;
  monthlyBilling: Array<{
    month: string;
    amount: number;
    plansAmount: number;
    setupAmount: number;
  }>;
  dailyBilling: Array<{
    date: string;
    amount: number;
    plansAmount: number;
    setupAmount: number;
  }>;
  newCustomers: Array<{
    month: string;
    count: number;
  }>;
  aiExecutions: Array<{
    month: string;
    all: number;
    analysis: number;
    transcription: number;
    scoring: number;
    suggestions: number;
  }>;
}

// Mock data for admin dashboard
const generateMockData = (): AdminDashboardData => {
  // Generate data for the last 13 months
  const months = Array.from({ length: 13 }).map((_, index) => {
    const date = subMonths(new Date(), index);
    return format(date, 'MMM/yyyy');
  }).reverse();

  // Generate random billing data
  const monthlyBilling = months.map(month => {
    const totalAmount = Math.floor(Math.random() * 50000) + 10000;
    const plansAmount = Math.floor(totalAmount * (0.6 + Math.random() * 0.2)); // 60-80% do total
    const setupAmount = totalAmount - plansAmount;
    
    return {
      month,
      amount: totalAmount,
      plansAmount,
      setupAmount
    };
  });

  // Generate daily billing data for the last 31 days
  const dailyBilling = Array.from({ length: 31 }).map((_, index) => {
    const date = subDays(new Date(), index);
    const dateString = format(date, 'yyyy-MM-dd');
    const totalAmount = Math.floor(Math.random() * 5000) + 1000;
    const plansAmount = Math.floor(totalAmount * (0.6 + Math.random() * 0.2)); // 60-80% do total
    const setupAmount = totalAmount - plansAmount;
    
    return {
      date: dateString,
      amount: totalAmount,
      plansAmount,
      setupAmount
    };
  }).reverse();

  // Generate random new customers data
  const newCustomers = months.map(month => ({
    month,
    count: Math.floor(Math.random() * 15) + 1,
  }));

  // Generate random AI executions data
  const aiExecutions = months.map(month => {
    const analysis = Math.floor(Math.random() * 500) + 100;
    const transcription = Math.floor(Math.random() * 300) + 50;
    const scoring = Math.floor(Math.random() * 200) + 30;
    const suggestions = Math.floor(Math.random() * 100) + 20;
    
    return {
      month,
      all: analysis + transcription + scoring + suggestions,
      analysis,
      transcription,
      scoring,
      suggestions,
    };
  });

  return {
    activeOrganizations: 28,
    pendingSetups: 12,
    inactiveUsers: 8,
    monthlyBilling,
    dailyBilling,
    newCustomers,
    aiExecutions,
  };
};

// Determine where the hook is being used - admin or organization
const isAdminDashboard = () => {
  const path = window.location.pathname;
  return path.includes('/admin/');
};

// Default mock sellers for organization dashboard
const defaultSellers = [
  { id: '1', name: 'Ana Silva' },
  { id: '2', name: 'Carlos Santos' },
  { id: '3', name: 'Mariana Oliveira' },
  { id: '4', name: 'Rafael Lima' },
  { id: '5', name: 'Juliana Costa' }
];

export const useDashboardData = () => {
  const [adminData, setAdminData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // For Organization dashboard
  const [monthlyLeadsDate, setMonthlyLeadsDate] = useState<Date | null>(new Date());
  const [dailyLeadsDate, setDailyLeadsDate] = useState<Date | null>(new Date());
  const [callsDate, setCallsDate] = useState<Date | null>(new Date());
  const [performanceDate, setPerformanceDate] = useState<Date | null>(new Date());
  const [monthlyObjectionsDate, setMonthlyObjectionsDate] = useState<Date | null>(new Date());
  const [monthlySuggestionsDate, setMonthlySuggestionsDate] = useState<Date | null>(new Date());
  
  const [monthlyCallsSeller, setMonthlyCallsSeller] = useState<string>('all');
  const [dailyCallsSeller, setDailyCallsSeller] = useState<string>('all');
  const [monthlyLeadsSeller, setMonthlyLeadsSeller] = useState<string>('all');
  const [dailyLeadsSeller, setDailyLeadsSeller] = useState<string>('all');
  const [monthlyObjectionsSeller, setMonthlyObjectionsSeller] = useState<string>('all');
  const [objectionTrendsSeller, setObjectionTrendsSeller] = useState<string>('all');
  const [monthlySuggestionsSeller, setMonthlySuggestionsSeller] = useState<string>('all');
  
  const [dailyMetric, setDailyMetric] = useState<string>('conversion');
  const [monthlyMetric, setMonthlyMetric] = useState<string>('conversion');

  // Mock data for organization dashboard
  const monthStats = { total: 320, processed: 300, failed: 20 };
  const dailyLeadsData = [];
  const monthlyLeadsData = [];
  const dailyCallsData = [];
  const monthlyCallsData = [];
  const dailyPerformanceData = [];
  const monthlyPerformanceData = [];
  const objectionsData = [];
  const objectionTrendsData = [];
  const objectionExamples = [];
  const suggestionsData = [];
  const sellers = defaultSellers;

  const updateSuggestionStatus = () => {};

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real application, this would fetch data from Supabase
        // For now, we'll use mock data for UI development
        
        // For admin dashboard
        if (isAdminDashboard()) {
          const mockData = generateMockData();
          
          // Simulate network delay
          setTimeout(() => {
            setAdminData(mockData);
            setIsLoading(false);
          }, 800);
        } else {
          // For organization dashboard, we'll just set isLoading to false
          // since we're using the mock data defined above
          setTimeout(() => {
            setIsLoading(false);
          }, 800);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Return different data structure based on where the hook is being used
  if (isAdminDashboard()) {
    return {
      data: adminData,
      isLoading,
      error,
    };
  } else {
    // Return the organization dashboard structure
    return {
      // Data points
      monthStats,
      dailyLeadsData,
      monthlyLeadsData,
      dailyCallsData,
      monthlyCallsData,
      dailyPerformanceData,
      monthlyPerformanceData,
      objectionsData,
      objectionTrendsData,
      objectionExamples,
      suggestionsData,
      sellers,
      
      // Date selectors
      monthlyLeadsDate,
      setMonthlyLeadsDate,
      dailyLeadsDate,
      setDailyLeadsDate,
      callsDate,
      setCallsDate,
      performanceDate,
      monthlyObjectionsDate,
      setMonthlyObjectionsDate,
      monthlySuggestionsDate,
      setMonthlySuggestionsDate,
      
      // Seller selectors
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
      monthlySuggestionsSeller,
      setMonthlySuggestionsSeller,
      
      // Metric selectors
      dailyMetric,
      setDailyMetric,
      monthlyMetric,
      setMonthlyMetric,
      
      // Functions
      updateSuggestionStatus,
      
      // Loading state
      isLoading,
      error,
    };
  }
};
