import { toast } from "sonner";

// Interface para o saldo de créditos
export interface CreditBalance {
  id: string;
  organizationId: string;
  totalCredits: number;
  usedCredits: number;
  additionalCredits: number;
  updatedAt: string;
}

// Dados mockados de créditos
const mockCreditBalances: CreditBalance[] = [
  {
    id: "1",
    organizationId: "org1",
    totalCredits: 100,
    usedCredits: 45,
    additionalCredits: 20,
    updatedAt: new Date().toISOString()
  }
];

// Função para buscar o saldo de créditos de uma organização
export async function fetchCreditBalance(organizationId: string = "org1"): Promise<CreditBalance | null> {
  try {
    // Simula um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const creditBalance = mockCreditBalances.find(balance => balance.organizationId === organizationId);
    
    if (!creditBalance) {
      // Se não encontrar, cria um saldo padrão
      const defaultBalance: CreditBalance = {
        id: `credit-${Date.now()}`,
        organizationId,
        totalCredits: 100,
        usedCredits: 30,
        additionalCredits: 10,
        updatedAt: new Date().toISOString()
      };
      
      return defaultBalance;
    }
    
    return creditBalance;
  } catch (error) {
    console.error('Erro ao buscar saldo de créditos:', error);
    return null;
  }
}

// Função para adicionar créditos adicionais
export async function addCredits(organizationId: string, amount: number): Promise<CreditBalance | null> {
  try {
    // Simula um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const creditBalance = await fetchCreditBalance(organizationId);
    
    if (!creditBalance) {
      throw new Error("Saldo de créditos não encontrado");
    }
    
    const updatedBalance: CreditBalance = {
      ...creditBalance,
      additionalCredits: creditBalance.additionalCredits + amount,
      updatedAt: new Date().toISOString()
    };
    
    toast.success(`${amount} créditos adicionados com sucesso!`);
    return updatedBalance;
  } catch (error) {
    console.error('Erro ao adicionar créditos:', error);
    toast.error('Não foi possível adicionar créditos.');
    return null;
  }
}

// Função para usar créditos
export async function useCredits(organizationId: string, amount: number): Promise<CreditBalance | null> {
  try {
    // Simula um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const creditBalance = await fetchCreditBalance(organizationId);
    
    if (!creditBalance) {
      throw new Error("Saldo de créditos não encontrado");
    }
    
    const availableCredits = (creditBalance.totalCredits - creditBalance.usedCredits) + creditBalance.additionalCredits;
    
    if (availableCredits < amount) {
      toast.error('Saldo de créditos insuficiente');
      return creditBalance;
    }
    
    // Primeiro usa os créditos do plano mensal
    let remainingAmount = amount;
    let usedFromMonthly = Math.min(creditBalance.totalCredits - creditBalance.usedCredits, remainingAmount);
    remainingAmount -= usedFromMonthly;
    
    // Se ainda houver créditos a serem usados, usa os adicionais
    let usedFromAdditional = Math.min(creditBalance.additionalCredits, remainingAmount);
    
    const updatedBalance: CreditBalance = {
      ...creditBalance,
      usedCredits: creditBalance.usedCredits + usedFromMonthly,
      additionalCredits: creditBalance.additionalCredits - usedFromAdditional,
      updatedAt: new Date().toISOString()
    };
    
    return updatedBalance;
  } catch (error) {
    console.error('Erro ao usar créditos:', error);
    toast.error('Não foi possível usar os créditos.');
    return null;
  }
}
