/**
 * Utilitário para gerenciar a configuração e validação do Stripe
 * Versão mockada sem dependências do Supabase
 */

import { loadStripe } from "@stripe/stripe-js";

// Chave mockada do Stripe para desenvolvimento
const MOCK_STRIPE_KEY = "pk_test_mockStripeKeyForDevelopment";

// Função para obter a chave pública do Stripe com validação
export const getStripePublicKey = async (): Promise<string> => {
  try {
    // Versão mockada que retorna uma chave de teste fixa
    console.log("Usando chave mockada do Stripe para desenvolvimento");
    return MOCK_STRIPE_KEY;
  } catch (error) {
    console.error("Exceção ao buscar chave do Stripe:", error);
    return "";
  }
};

// Função para obter a chave local da variável de ambiente
const getLocalStripeKey = (): string => {
  // Versão mockada que retorna uma chave de teste fixa
  return MOCK_STRIPE_KEY;
};

// Validar formato da chave
const validateStripeKey = (stripeKey: string | undefined): string => {
  if (!stripeKey) {
    console.error(
      "ERRO: Chave pública do Stripe não encontrada.",
      "Certifique-se de que a chave está definida como variável de ambiente."
    );
    return "";
  }
  
  // Verificar se é uma chave de teste (recomendado para desenvolvimento)
  if (stripeKey.startsWith('pk_test_')) {
    console.log("Usando chave de TESTE do Stripe");
  } else if (stripeKey.startsWith('pk_live_')) {
    console.warn("ATENÇÃO: Usando chave de PRODUÇÃO do Stripe");
  } else if (!stripeKey.startsWith('pk_')) {
    console.error(
      "ERRO: Formato inválido para chave pública do Stripe.",
      "A chave pública do Stripe deve começar com 'pk_test_' ou 'pk_live_'."
    );
    return "";
  }
  
  return stripeKey;
};

// Função para carregar o Stripe com tratamento de erro
export const initializeStripe = async () => {
  const stripeKey = await getStripePublicKey();
  
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

// Interface para o status da configuração do Stripe
export interface StripeConfigStatus {
  valid: boolean;
  message: string;
}

// Verificar e retornar status da configuração do Stripe com valor inicial
// Retorna um objeto com status inicial e uma função para atualizar o status
export const getInitialStripeStatus = (): StripeConfigStatus => {
  return { 
    valid: false, 
    message: "Verificando configuração do Stripe..." 
  };
};

// Função assíncrona para verificar a configuração do Stripe
export const validateStripeConfig = async (): Promise<StripeConfigStatus> => {
  // Versão mockada que sempre retorna sucesso
  return { 
    valid: true, 
    message: "Configuração do Stripe válida. Usando chave de teste mockada para desenvolvimento." 
  };
};
