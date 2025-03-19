import { useEffect, useState } from 'react';
import { MonthStats } from '@/types/calls';
import { mockDashboardStats } from '@/mocks/dashboardMocks';

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

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // In a real application, this would be an API call
      // For now, we're just simulating with a timeout and mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockData: DashboardData = {
        callsStats: {
          total: 150,
          active: 120,
          pending: 20,
          processed: 100,
          failed: 10
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
        
      setData(mockData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to mockDashboardStats
      setData(mockDashboardStats);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  return {
    data,
    isLoading,
    dateRange,
    setDateRange
  };
};
