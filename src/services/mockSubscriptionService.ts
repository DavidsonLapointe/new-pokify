import { toast } from "sonner";

export interface PaymentMethodResponse {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

// Dados mockados de método de pagamento
const mockPaymentMethods: Record<string, PaymentMethodResponse> = {
  "org1": {
    id: "pm_mock_123456",
    brand: "visa",
    last4: "4242",
    expMonth: 12,
    expYear: 2025
  }
};

// Função para buscar o método de pagamento de uma organização
export async function getPaymentMethod(organizationId: string): Promise<PaymentMethodResponse | null> {
  try {
    // Simula um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockPaymentMethods[organizationId] || null;
  } catch (error) {
    console.error('Erro ao buscar método de pagamento:', error);
    return null;
  }
}

// Função para salvar um método de pagamento
export async function savePaymentMethod(
  organizationId: string, 
  paymentMethod: Omit<PaymentMethodResponse, 'id'>
): Promise<PaymentMethodResponse> {
  try {
    // Simula um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newPaymentMethod: PaymentMethodResponse = {
      ...paymentMethod,
      id: `pm_mock_${Date.now()}`
    };
    
    // Em uma implementação real, armazenaria no banco de dados
    mockPaymentMethods[organizationId] = newPaymentMethod;
    
    toast.success('Método de pagamento salvo com sucesso!');
    return newPaymentMethod;
  } catch (error) {
    console.error('Erro ao salvar método de pagamento:', error);
    toast.error('Não foi possível salvar o método de pagamento.');
    throw error;
  }
}

// Função para processar um pagamento
export async function processPayment(
  organizationId: string,
  amount: number,
  paymentMethodId?: string
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  try {
    // Simula um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Simula uma taxa de sucesso de 90%
    const isSuccessful = Math.random() < 0.9;
    
    if (isSuccessful) {
      // Adiciona créditos ao saldo da organização (em uma implementação real)
      // Aqui seria chamado o serviço de créditos para atualizar o saldo
      
      return {
        success: true,
        transactionId: `tx_mock_${Date.now()}`
      };
    } else {
      return {
        success: false,
        error: 'Pagamento recusado pela operadora do cartão.'
      };
    }
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    return {
      success: false,
      error: 'Erro ao processar pagamento. Tente novamente mais tarde.'
    };
  }
}
