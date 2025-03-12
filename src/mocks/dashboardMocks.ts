
import { randomNumber } from './utils';

// Dados mockados para o dashboard
export const mockDashboardData = {
  // Dados de estatísticas gerais
  monthStats: {
    total: randomNumber(100, 500),
    processed: randomNumber(80, 400),
    failed: randomNumber(5, 50),
    leads: randomNumber(50, 200),
    conversions: randomNumber(10, 50),
  },
  
  // Gráfico de leads diários
  dailyLeadsData: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    total: randomNumber(5, 30),
    conversions: randomNumber(1, 10),
    rate: Math.random() * 0.5 + 0.1,
  })),
  
  // Gráfico de leads mensais
  monthlyLeadsData: Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2023, i, 1).toISOString().split('T')[0],
    total: randomNumber(100, 500),
    conversions: randomNumber(20, 150),
    rate: Math.random() * 0.5 + 0.1,
  })),
  
  // Gráfico de chamadas diárias
  dailyCallsData: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    total: randomNumber(5, 50),
    processed: randomNumber(4, 45),
    failed: randomNumber(0, 5),
  })),
  
  // Gráfico de chamadas mensais
  monthlyCallsData: Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2023, i, 1).toISOString().split('T')[0],
    total: randomNumber(150, 800),
    processed: randomNumber(140, 750),
    failed: randomNumber(5, 50),
  })),
  
  // Desempenho diário
  dailyPerformanceData: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    calls: randomNumber(10, 50),
    leads: randomNumber(5, 30),
    conversions: randomNumber(1, 10),
    conversionRate: Math.random() * 0.5 + 0.1,
  })),
  
  // Desempenho mensal
  monthlyPerformanceData: Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2023, i, 1).toISOString().split('T')[0],
    calls: randomNumber(300, 1500),
    leads: randomNumber(150, 600),
    conversions: randomNumber(20, 150),
    conversionRate: Math.random() * 0.5 + 0.2,
  })),
  
  // Dados de objeções
  objectionsData: [
    { name: 'Preço alto', value: randomNumber(20, 100) },
    { name: 'Concorrente melhor', value: randomNumber(15, 80) },
    { name: 'Sem orçamento', value: randomNumber(10, 70) },
    { name: 'Não é prioridade', value: randomNumber(10, 60) },
    { name: 'Já tem solução', value: randomNumber(5, 50) },
    { name: 'Outros', value: randomNumber(5, 30) },
  ],
  
  // Tendências de objeções
  objectionTrendsData: Array.from({ length: 6 }, (_, i) => ({
    month: new Date(2023, i, 1).toISOString().split('T')[0],
    'Preço alto': randomNumber(10, 50),
    'Concorrente melhor': randomNumber(5, 40),
    'Sem orçamento': randomNumber(5, 35),
    'Não é prioridade': randomNumber(5, 30),
    'Já tem solução': randomNumber(5, 25),
    'Outros': randomNumber(3, 20),
  })),
  
  // Exemplos de objeções
  objectionExamples: [
    { id: '1', objection: 'Preço alto', example: 'O valor está acima do nosso orçamento neste momento.', leadName: 'Empresa ABC' },
    { id: '2', objection: 'Concorrente melhor', example: 'Já estamos em negociação com outro fornecedor que oferece mais recursos.', leadName: 'Empresa XYZ' },
    { id: '3', objection: 'Sem orçamento', example: 'Não temos verba disponível para este tipo de investimento agora.', leadName: 'Empresa 123' },
    { id: '4', objection: 'Não é prioridade', example: 'No momento estamos focados em outros projetos mais urgentes.', leadName: 'Empresa DEF' },
    { id: '5', objection: 'Já tem solução', example: 'Já contratamos uma ferramenta semelhante recentemente.', leadName: 'Empresa GHI' },
  ],
  
  // Dados de sugestões
  suggestionsData: Array.from({ length: 15 }, (_, i) => ({
    id: `sugestao-${i + 1}`,
    date: new Date(Date.now() - randomNumber(1, 60) * 24 * 60 * 60 * 1000).toISOString(),
    seller: `Vendedor ${randomNumber(1, 10)}`,
    call: `Chamada ${randomNumber(1000, 9999)}`,
    lead: `Lead ${randomNumber(1000, 9999)}`,
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
    status: ['pending', 'implemented', 'rejected'][randomNumber(0, 2)],
  })),
};
