
// Plans mocks
export const mockPlans = [
  {
    id: 1,
    name: 'Básico',
    description: 'Plano básico para empresas iniciantes',
    shortDescription: 'Ideal para pequenas empresas começando a usar IA',
    price: 97,
    features: [
      'Até 5 usuários',
      'Análise de 50 leads por mês',
      'Suporte por email',
      'Integrações básicas'
    ],
    benefits: [
      'Até 5 usuários',
      'Análise de 50 leads por mês',
      'Suporte por email',
      'Integrações básicas'
    ],
    active: true,
    credits: 100,
    stripeProductId: 'mock_product_basic',
    stripePriceId: 'mock_price_basic'
  },
  {
    id: 2,
    name: 'Profissional',
    description: 'Plano ideal para empresas em crescimento',
    shortDescription: 'Perfeito para empresas em expansão',
    price: 197,
    features: [
      'Até 15 usuários',
      'Análise de 200 leads por mês',
      'Suporte prioritário',
      'Todas as integrações',
      'Dashboard avançado'
    ],
    benefits: [
      'Até 15 usuários',
      'Análise de 200 leads por mês',
      'Suporte prioritário',
      'Todas as integrações',
      'Dashboard avançado'
    ],
    active: true,
    credits: 300,
    stripeProductId: 'mock_product_pro',
    stripePriceId: 'mock_price_pro'
  },
  {
    id: 3,
    name: 'Empresarial',
    description: 'Para grandes empresas com necessidades avançadas',
    shortDescription: 'Solução completa para grandes empresas',
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
    benefits: [
      'Usuários ilimitados',
      'Análise de 1000 leads por mês',
      'Suporte 24/7',
      'Todas as integrações',
      'Dashboard personalizado',
      'API exclusiva',
      'Treinamento dedicado'
    ],
    active: true,
    credits: 1000,
    stripeProductId: 'mock_product_enterprise',
    stripePriceId: 'mock_price_enterprise'
  }
];
