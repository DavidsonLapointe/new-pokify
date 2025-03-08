
/**
 * Utilitário para gerenciar a configuração e validação do Stripe
 */

import { loadStripe } from "@stripe/stripe-js";

// Função para obter a chave pública do Stripe com validação
export const getStripePublicKey = (): string => {
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  
  if (!stripeKey) {
    console.error(
      "ERRO: Variável de ambiente VITE_STRIPE_PUBLIC_KEY não encontrada.",
      "Certifique-se de que a variável está definida no seu arquivo .env ou nas variáveis de ambiente."
    );
    return "";
  }
  
  // Validação básica do formato da chave (deve começar com pk_)
  if (!stripeKey.startsWith('pk_')) {
    console.error(
      "ERRO: Formato inválido para VITE_STRIPE_PUBLIC_KEY.",
      "A chave pública do Stripe deve começar com 'pk_'."
    );
    return "";
  }
  
  return stripeKey;
};

// Função para carregar o Stripe com tratamento de erro
export const initializeStripe = () => {
  const stripeKey = getStripePublicKey();
  
  if (!stripeKey) {
    return null;
  }
  
  try {
    return loadStripe(stripeKey);
  } catch (error) {
    console.error("Erro ao inicializar o Stripe:", error);
    return null;
  }
};

// Carregando o Stripe uma única vez para reuso
export const stripePromise = initializeStripe();

// Verificar e retornar status da configuração do Stripe
export const validateStripeConfig = (): { valid: boolean; message: string } => {
  const stripeKey = getStripePublicKey();
  
  if (!stripeKey) {
    return { 
      valid: false, 
      message: "Chave do Stripe não configurada. Configure a variável de ambiente VITE_STRIPE_PUBLIC_KEY." 
    };
  }
  
  if (!stripeKey.startsWith('pk_')) {
    return { 
      valid: false, 
      message: "Formato inválido da chave do Stripe. Deve começar com 'pk_'." 
    };
  }
  
  return { 
    valid: true, 
    message: `Configuração do Stripe válida. Usando chave: ${stripeKey.substring(0, 8)}...` 
  };
};
