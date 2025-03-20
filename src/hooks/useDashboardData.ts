
import { useState, useEffect, useMemo } from 'react';
import { format, subMonths, subDays, parseISO, subWeeks, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

// Types for the admin dashboard data
export interface AdminDashboardData {
  activeOrganizations: number;
  pendingSetups: number;
  inactiveUsers: number;
  inactiveOrganizations: Array<{
    id: string;
    name: string;
    adminName: string;
    adminEmail: string;
    adminPhone?: string;
    lastAccessDate: string;
    lastAccessUser: string;
  }>;
  lowCreditsOrganizations: Array<{
    id: string;
    name: string;
    adminName: string;
    adminEmail: string;
    adminPhone?: string;
    remainingCredits: number;
    lastAccessDate: string;
    lastAccessUser: string;
  }>;
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

  // Mock inactive organizations
  const inactiveOrganizations = [
    {
      id: '1',
      name: 'Empresa Tech ABC',
      adminName: 'João Silva',
      adminEmail: 'joao.silva@empresatech.com',
      adminPhone: '(11) 98765-4321',
      lastAccessDate: '2023-10-15T14:30:00Z',
      lastAccessUser: 'Ana Souza (Vendedora)'
    },
    {
      id: '2',
      name: 'Consultoria XYZ',
      adminName: 'Maria Oliveira',
      adminEmail: 'maria@consultoriaxyz.com.br',
      adminPhone: '(21) 97654-3210',
      lastAccessDate: '2023-10-12T09:15:00Z',
      lastAccessUser: 'Carlos Mendes (Gerente)'
    },
    {
      id: '3',
      name: 'Indústria Solutions',
      adminName: 'Pedro Santos',
      adminEmail: 'pedro@industriasolutions.com',
      adminPhone: '(31) 99876-5432',
      lastAccessDate: '2023-10-10T16:45:00Z',
      lastAccessUser: 'Mariana Lima (Vendedora)'
    }
  ];

  // Mock low credits organizations
  const lowCreditsOrganizations = [
    {
      id: '4',
      name: 'Startup Inovação',
      adminName: 'Rafael Costa',
      adminEmail: 'rafael@startupinova.com',
      adminPhone: '(11) 97777-8888',
      remainingCredits: 32,
      lastAccessDate: '2023-10-18T10:30:00Z',
      lastAccessUser: 'Rafael Costa (Administrador)'
    },
    {
      id: '5',
      name: 'Marketing Digital Ltda',
      adminName: 'Bianca Souza',
      adminEmail: 'bianca@marketingdigital.com.br',
      adminPhone: '(21) 98888-7777',
      remainingCredits: 12,
      lastAccessDate: '2023-10-17T14:45:00Z',
      lastAccessUser: 'Bianca Souza (Administrador)'
    },
    {
      id: '6',
      name: 'Vendas Express',
      adminName: 'Thiago Mendes',
      adminEmail: 'thiago@vendasexpress.com',
      adminPhone: '(31) 96666-5555',
      remainingCredits: 47,
      lastAccessDate: '2023-10-16T09:15:00Z',
      lastAccessUser: 'Paulo Almeida (Vendedor)'
    },
    {
      id: '7',
      name: 'Tecnologia Ágil',
      adminName: 'Amanda Ferreira',
      adminEmail: 'amanda@tecagil.com',
      adminPhone: '(11) 95555-4444',
      remainingCredits: 8,
      lastAccessDate: '2023-10-15T16:20:00Z',
      lastAccessUser: 'Amanda Ferreira (Administrador)'
    }
  ];

  return {
    activeOrganizations: 28,
    pendingSetups: 12,
    inactiveUsers: inactiveOrganizations.length,
    inactiveOrganizations,
    lowCreditsOrganizations,
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

// Generate Organization Dashboard Data - Leads Data
const generateOrgDailyLeadsData = (date: Date, sellerId: string = 'all') => {
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const data = [];
  
  for (let i = 1; i <= daysInMonth; i++) {
    const day = new Date(date.getFullYear(), date.getMonth(), i);
    const formattedDay = format(day, 'dd/MM');
    
    // Different data based on seller selection
    let value = Math.floor(Math.random() * 10) + 1;
    if (sellerId !== 'all') {
      // Specific seller data will have lower numbers
      value = Math.floor(value * 0.7);
    }
    
    data.push({
      day: formattedDay,
      novos: value
    });
  }
  
  return data;
};

// Generate Organization Dashboard Data - Monthly Leads Data
const generateOrgMonthlyLeadsData = (date: Date, sellerId: string = 'all') => {
  const data = [];
  
  for (let i = 12; i >= 0; i--) {
    const month = subMonths(date, i);
    const formattedMonth = format(month, 'MMM/yy', { locale: ptBR });
    
    // Different data based on seller selection
    let value = Math.floor(Math.random() * 50) + 10;
    if (sellerId !== 'all') {
      // Specific seller data will have lower numbers
      value = Math.floor(value * 0.7);
    }
    
    data.push({
      month: formattedMonth,
      novos: value
    });
  }
  
  return data;
};

// Generate Organization Dashboard Data - Monthly Calls Data
const generateOrgMonthlyCallsData = (sellerId: string = 'all') => {
  const today = new Date();
  const data = [];
  
  for (let i = 12; i >= 0; i--) {
    const month = subMonths(today, i);
    const formattedMonth = format(month, 'MMM/yy', { locale: ptBR });
    
    // Different data based on seller selection
    let value = Math.floor(Math.random() * 70) + 30;
    if (sellerId !== 'all') {
      // Specific seller data will have lower numbers
      value = Math.floor(value * 0.8);
    }
    
    data.push({
      month: formattedMonth,
      calls: value
    });
  }
  
  return data;
};

// Generate Organization Dashboard Data - Daily Calls Data
const generateOrgDailyCallsData = (date: Date, sellerId: string = 'all') => {
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const data = [];
  
  for (let i = 1; i <= daysInMonth; i++) {
    const day = new Date(date.getFullYear(), date.getMonth(), i);
    const formattedDay = format(day, 'dd/MM');
    
    // Different data based on seller selection
    let value = Math.floor(Math.random() * 5) + 1;
    if (sellerId !== 'all') {
      // Specific seller data will have lower numbers
      value = Math.floor(value * 0.8);
    }
    
    data.push({
      day: formattedDay,
      calls: value
    });
  }
  
  return data;
};

// Generate Organization Dashboard Data - Performance Data
const generatePerformanceData = (metric: string = 'conversion') => {
  const data = [];
  
  for (const seller of defaultSellers) {
    let value;
    
    if (metric === 'conversion') {
      // Conversion rates between 30% and 70%
      value = 30 + Math.floor(Math.random() * 40);
    } else if (metric === 'calltime') {
      // Call time between 100 and 400 seconds
      value = 100 + Math.floor(Math.random() * 300);
    } else {
      // Default case - random value
      value = Math.floor(Math.random() * 100);
    }
    
    data.push({
      name: seller.name,
      [metric]: value
    });
  }
  
  return data;
};

// Generate Organization Dashboard Data - Objections Data
const generateObjectionsData = (sellerId: string = 'all') => {
  const objectionTypes = [
    'Preço', 'Prazo', 'Funcionalidades', 
    'Concorrência', 'Necessidade', 'Orçamento',
    'Decisão interna', 'Tecnologia', 'Suporte'
  ];
  
  return objectionTypes.map(type => {
    // Different data based on seller selection
    let count = Math.floor(Math.random() * 20) + 5;
    if (sellerId !== 'all') {
      // Specific seller data will have lower numbers
      count = Math.floor(count * 0.7);
    }
    
    return {
      name: type,
      count
    };
  }).sort((a, b) => b.count - a.count).slice(0, 5); // Top 5 objections
};

// Generate Organization Dashboard Data - Objection Trends
const generateObjectionTrendsData = (sellerId: string = 'all') => {
  const data = [];
  const today = new Date();
  
  // Top 3 objections to track
  const topObjections = ['Preço', 'Prazo', 'Funcionalidades'];
  
  for (let i = 12; i >= 0; i--) {
    const month = subMonths(today, i);
    const entry: any = {
      month: format(month, 'MMM/yy', { locale: ptBR })
    };
    
    topObjections.forEach(objection => {
      // Different data based on seller selection
      let count = Math.floor(Math.random() * 15) + 1;
      if (sellerId !== 'all') {
        // Specific seller data will have lower numbers
        count = Math.floor(count * 0.7);
      }
      
      entry[objection] = count;
    });
    
    data.push(entry);
  }
  
  return data;
};

// Generate Organization Dashboard Data - Suggestions Data
const generateSuggestionsData = (sellerId: string = 'all') => {
  const suggestions = [
    { text: 'Focar em demonstrar o ROI para o cliente', category: 'pricing' },
    { text: 'Apresentar casos de sucesso similares', category: 'objection' },
    { text: 'Oferecer período de teste estendido', category: 'closing' },
    { text: 'Destacar diferenciais em relação à concorrência', category: 'pitch' },
    { text: 'Utilizar abordagem consultiva em vez de venda direta', category: 'approach' },
    { text: 'Envolver tomador de decisão no início do processo', category: 'process' },
    { text: 'Oferecer desconto para pagamento à vista', category: 'pricing' }
  ];
  
  return suggestions.map(suggestion => {
    // Different data based on seller selection
    let occurrence = Math.floor(Math.random() * 15) + 3;
    if (sellerId !== 'all') {
      // Specific seller data will have lower numbers
      occurrence = Math.floor(occurrence * 0.7);
    }
    
    const impacts = ['low', 'medium', 'high'];
    const randomImpact = impacts[Math.floor(Math.random() * impacts.length)];
    
    return {
      id: Math.random().toString(36).substring(2, 9),
      suggestion: suggestion.text,
      category: suggestion.category,
      occurrence,
      impact: randomImpact,
      status: Math.random() > 0.5 ? 'active' : 'implemented'
    };
  });
};

// Generate mock examples of objections
const generateObjectionExamples = () => {
  return [
    {
      id: '1',
      text: 'Cliente mencionou que o preço está acima do orçamento disponível',
      date: subDays(new Date(), 3).toISOString(),
      seller: 'Ana Silva',
      lead: 'Empresa ABC'
    },
    {
      id: '2',
      text: 'Cliente quer características que não estão em nosso roadmap',
      date: subDays(new Date(), 5).toISOString(),
      seller: 'Carlos Santos',
      lead: 'Consultoria XYZ'
    },
    {
      id: '3',
      text: 'Decisão de compra precisa passar por mais 2 pessoas',
      date: subDays(new Date(), 7).toISOString(),
      seller: 'Mariana Oliveira',
      lead: 'Indústria Tech'
    }
  ];
};

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

  // Memoized data for organization dashboard
  const monthStats = useMemo(() => ({
    total: 320, 
    processed: 300,
    failed: 20,
    active: 250,
    pending: 50
  }), []);
  
  const dailyLeadsData = useMemo(() => 
    generateOrgDailyLeadsData(dailyLeadsDate || new Date(), dailyLeadsSeller),
  [dailyLeadsDate, dailyLeadsSeller]);
  
  const monthlyLeadsData = useMemo(() => 
    generateOrgMonthlyLeadsData(monthlyLeadsDate || new Date(), monthlyLeadsSeller),
  [monthlyLeadsDate, monthlyLeadsSeller]);
  
  const dailyCallsData = useMemo(() => 
    generateOrgDailyCallsData(callsDate || new Date(), dailyCallsSeller),
  [callsDate, dailyCallsSeller]);
  
  const monthlyCallsData = useMemo(() => 
    generateOrgMonthlyCallsData(monthlyCallsSeller),
  [monthlyCallsSeller]);
  
  const dailyPerformanceData = useMemo(() => 
    generatePerformanceData(dailyMetric),
  [dailyMetric]);
  
  const monthlyPerformanceData = useMemo(() => 
    generatePerformanceData(monthlyMetric),
  [monthlyMetric]);
  
  const objectionsData = useMemo(() => 
    generateObjectionsData(monthlyObjectionsSeller),
  [monthlyObjectionsSeller]);
  
  const objectionTrendsData = useMemo(() => 
    generateObjectionTrendsData(objectionTrendsSeller),
  [objectionTrendsSeller]);
  
  const objectionExamples = useMemo(() => 
    generateObjectionExamples(),
  []);
  
  const suggestionsData = useMemo(() => 
    generateSuggestionsData(monthlySuggestionsSeller),
  [monthlySuggestionsSeller]);
  
  const sellers = useMemo(() => defaultSellers, []);

  const updateSuggestionStatus = () => {
    // Mock implementation - in a real app this would update the status in the database
    console.log("Suggestion status would be updated here");
  };

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
          // since we're using the memoized data defined above
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
      setPerformanceDate,
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
