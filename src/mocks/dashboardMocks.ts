
import { randomNumber } from './utils';
import { Suggestion } from '@/components/dashboard/types/suggestions';
import { format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Generate consistent lead data
const generateLeadData = (count: number, baseValue: number, variance: number) => 
  Math.round(baseValue + (Math.random() * variance * 2) - variance);

// Generate consistent trend data
const generateTrendData = (months: number, values: {[key: string]: number}) => {
  const currentDate = new Date();
  
  return Array.from({ length: months }, (_, i) => {
    const date = subMonths(currentDate, months - i - 1);
    const monthStr = format(date, 'MMM/yy', { locale: ptBR });
    
    const result: {[key: string]: any} = { month: monthStr };
    
    Object.keys(values).forEach(key => {
      const baseValue = values[key];
      const trend = i / (months - 1); // 0 to 1 trend factor
      const variance = baseValue * 0.2; // 20% variance
      
      // Slightly increase values over time for an upward trend
      result[key] = Math.round(baseValue * (0.8 + trend * 0.5) + (Math.random() * variance * 2) - variance);
    });
    
    return result;
  });
};

// Generate daily data with consistent pattern
const generateDailyData = (daysCount: number, baseValues: {[key: string]: number}) => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - daysCount + 1);
  
  return Array.from({ length: daysCount }, (_, i) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + i);
    const dayStr = format(date, 'dd/MM');
    
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const weekdayFactor = isWeekend ? 0.4 : 1; // Less activity on weekends
    
    const result: {[key: string]: any} = { 
      date: format(date, 'yyyy-MM-dd'),
      day: dayStr
    };
    
    Object.keys(baseValues).forEach(key => {
      const baseValue = baseValues[key];
      const variance = baseValue * 0.3; // 30% variance
      
      result[key] = Math.round(baseValue * weekdayFactor + (Math.random() * variance * 2) - variance);
      // Ensure we don't get negative values
      result[key] = Math.max(0, result[key]);
    });
    
    return result;
  });
};

// Cálculo de acumulados para garantir dados coerentes
const calcActiveLeads = 382;
const calcPendingLeads = 68;
const calcTotalLeads = calcActiveLeads + calcPendingLeads;

// Dados mockados para o dashboard com valores mais coerentes
export const mockDashboardData = {
  // Dados de estatísticas gerais com valores mais realistas
  monthStats: {
    total: calcTotalLeads,
    active: calcActiveLeads,
    pending: calcPendingLeads,
    processed: 362,
    failed: 20,
    leads: 180,
    conversions: 42,
  },
  
  // Gráfico de leads diários (somente novos leads)
  dailyLeadsData: generateDailyData(30, {
    novos: 8,
  }),
  
  // Gráfico de leads mensais (somente novos leads)
  monthlyLeadsData: generateTrendData(12, {
    novos: 40,
  }),
  
  // Gráfico de chamadas diárias
  dailyCallsData: generateDailyData(30, {
    total: 25,
    processed: 22,
    failed: 3,
    uploads: 18
  }),
  
  // Gráfico de chamadas mensais
  monthlyCallsData: generateTrendData(12, {
    total: 600,
    processed: 560,
    failed: 40,
    uploads: 450
  }),
  
  // Desempenho diário
  dailyPerformanceData: generateDailyData(30, {
    joao: 28,
    maria: 22
  }),
  
  // Desempenho mensal
  monthlyPerformanceData: generateTrendData(12, {
    joao: 650,
    maria: 520
  }),
  
  // Dados de objeções - valores coerentes e consistentes
  objectionsData: [
    { name: 'Preço muito alto', value: 28, count: 28 },
    { name: 'Não tenho orçamento no momento', value: 24, count: 24 },
    { name: 'Concorrente oferece mais', value: 18, count: 18 },
    { name: 'Sem necessidade atual', value: 16, count: 16 },
    { name: 'Já possuímos solução similar', value: 12, count: 12 },
    { name: 'Outros', value: 22, count: 22 },
  ],
  
  // Tendências de objeções - 6 meses de dados com padrões realistas
  objectionTrendsData: generateTrendData(6, {
    'Preço muito alto': 22,
    'Não tenho orçamento no momento': 25,
    'Concorrente oferece mais': 16,
    'Sem necessidade atual': 14,
    'Já possuímos solução similar': 10
  }),
  
  // Exemplos de objeções - ampliados para cobrir todos os tipos
  objectionExamples: {
    'Preço muito alto': [
      'O valor está acima do nosso orçamento neste momento.',
      'Encontramos opções mais acessíveis no mercado.',
      'O custo-benefício não justifica o investimento.'
    ],
    'Não tenho orçamento no momento': [
      'Não temos recurso financeiro no momento para este investimento.',
      'Nosso orçamento já foi comprometido para este trimestre.',
      'Precisaremos esperar o próximo ciclo orçamentário.'
    ],
    'Concorrente oferece mais': [
      'Já estamos em negociação com outro fornecedor que oferece mais recursos.',
      'O concorrente oferece condições melhores para nosso segmento.',
      'Encontramos uma solução que se encaixa melhor nas nossas necessidades.'
    ],
    'Sem necessidade atual': [
      'No momento não temos demanda para este tipo de solução.',
      'Nossa equipe atual consegue atender nossos processos sem problemas.',
      'Não é uma prioridade para nossa empresa neste momento.'
    ],
    'Já possuímos solução similar': [
      'Já contratamos uma ferramenta semelhante recentemente.',
      'Já temos uma solução implementada que cumpre essa função.',
      'Acabamos de renovar contrato com outro fornecedor.'
    ],
    'Outros': [
      'Precisamos de mais tempo para avaliar todas as opções disponíveis.',
      'Estamos passando por reestruturação interna no momento.',
      'Aguardamos definição da matriz sobre padronização global.'
    ]
  },
  
  // Dados de sugestões
  suggestionsData: Array.from({ length: 15 }, (_, i) => ({
    id: `sugestao-${i + 1}`,
    date: new Date(Date.now() - randomNumber(1, 60) * 24 * 60 * 60 * 1000).toISOString(),
    leadName: `Lead ${randomNumber(1000, 9999)}`,
    suggestion: [
      'Explicar melhor os benefícios do produto',
      'Oferecer desconto para fechar a venda',
      'Agendar demonstração com time técnico',
      'Compartilhar casos de sucesso do setor',
      'Apresentar ROI detalhado',
      'Adicionar funcionalidade específica',
      'Melhorar abordagem inicial',
      'Seguir com negociação via email',
    ][randomNumber(0, 7)],
    type: ['Abordagem', 'Negociação', 'Produto', 'Técnica'][randomNumber(0, 3)],
    subType: ['Preço', 'Apresentação', 'Funcionalidade', 'Comunicação', 'Demonstração'][randomNumber(0, 4)],
    status: ['pending', 'implemented', 'rejected'][randomNumber(0, 2)] as Suggestion['status'],
  })),
};
