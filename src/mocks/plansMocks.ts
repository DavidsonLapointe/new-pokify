
import { Plan } from "@/types/subscription";
import { v4 as uuidv4 } from "uuid";

export const mockPlans: Plan[] = [
  {
    id: uuidv4(),
    name: "Plano Básico",
    description: "Ideal para pequenas empresas começarem a utilizar a plataforma",
    price: 149.90,
    callsIncluded: 100,
    features: [
      "Análise de até 100 chamadas/mês",
      "Identificação de objeções e sugestões",
      "Dashboard básico",
      "Integração com 1 CRM"
    ],
    isPopular: false,
    active: true,
    stripeProductId: "prod_basic",
    stripePriceId: "price_basic"
  },
  {
    id: uuidv4(),
    name: "Plano Profissional",
    description: "Ideal para empresas em crescimento com equipe de vendas",
    price: 299.90,
    callsIncluded: 300,
    features: [
      "Análise de até 300 chamadas/mês",
      "Identificação de objeções e sugestões",
      "Dashboard completo",
      "Integração com múltiplos CRMs",
      "Relatórios de performance"
    ],
    isPopular: true,
    active: true,
    stripeProductId: "prod_professional",
    stripePriceId: "price_professional"
  },
  {
    id: uuidv4(),
    name: "Plano Enterprise",
    description: "Para empresas com grandes equipes de vendas",
    price: 599.90,
    callsIncluded: 1000,
    features: [
      "Análise ilimitada de chamadas",
      "Todas as funcionalidades do plano Profissional",
      "API personalizada",
      "Suporte premium 24/7",
      "Treinamento da equipe"
    ],
    isPopular: false,
    active: true,
    stripeProductId: "prod_enterprise",
    stripePriceId: "price_enterprise"
  }
];

export const mockSubscription = {
  id: uuidv4(),
  organizationId: "org-123",
  planId: mockPlans[1].id,
  plan: mockPlans[1],
  status: "active",
  startDate: "2023-05-01T00:00:00Z",
  currentPeriodEnd: "2023-06-01T00:00:00Z",
  cancelAtPeriodEnd: false,
  stripeSubscriptionId: "sub_123456",
  stripeCustomerId: "cus_123456"
};
