
import { useState, useEffect } from 'react';
import { format, subMonths, subDays, parseISO } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

// Types for the dashboard data
interface AdminDashboardData {
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

// Mock data for development
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

export const useDashboardData = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real application, this would fetch data from Supabase
        // For now, we'll use mock data for UI development
        
        // const { data: activeOrgs, error: activeOrgsError } = await supabase
        //   .from('organizations')
        //   .select('count')
        //   .eq('status', 'active');
        
        // if (activeOrgsError) throw activeOrgsError;
        
        // ... more real data fetching would happen here

        // For development, use mock data instead
        const mockData = generateMockData();
        
        // Simulate network delay
        setTimeout(() => {
          setData(mockData);
          setIsLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return {
    data,
    isLoading,
    error,
  };
};
