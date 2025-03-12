
// Plans mocks
export const mockPlans = [
  {
    id: 1,
    name: 'Básico',
    description: 'Plano básico para empresas iniciantes',
    price: 97,
    features: [
      'Até 5 usuários',
      'Análise de 50 leads por mês',
      'Suporte por email',
      'Integrações básicas'
    ],
    active: true,
    credits: 100
  },
  {
    id: 2,
    name: 'Profissional',
    description: 'Plano ideal para empresas em crescimento',
    price: 197,
    features: [
      'Até 15 usuários',
      'Análise de 200 leads por mês',
      'Suporte prioritário',
      'Todas as integrações',
      'Dashboard avançado'
    ],
    active: true,
    credits: 300
  },
  {
    id: 3,
    name: 'Empresarial',
    description: 'Para grandes empresas com necessidades avançadas',
    price: 497,
    features: [
      'Usuários ilimitados',
      'Análise de 1000 leads por mês',
      'Suporte 24/7',
      'Todas as integrações',
      'Dashboard personalizado',
      'API exclusiva',
      'Treinamento dedicado'
    ],
    active: true,
    credits: 1000
  },
  {
    id: 4,
    name: 'Customizado',
    description: 'Plano personalizado para necessidades específicas',
    price: 997,
    features: [
      'Tudo do plano Empresarial',
      'Customizações específicas',
      'Gerente de contas dedicado',
      'SLA garantido'
    ],
    active: false,
    credits: 2000
  }
];
