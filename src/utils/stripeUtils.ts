/**
 * Utilitário para gerenciar a configuração e validação do Stripe
 */

import { loadStripe } from "@stripe/stripe-js";
import { supabase } from "@/integrations/supabase/client";

// Função para obter a chave pública do Stripe com validação
export const getStripePublicKey = async (): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-stripe-key', {
      body: { type: 'public' },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (error) {
      console.error("Error fetching Stripe key:", error);
      return getLocalStripeKey();
    }
    
    if (data?.key) {
      console.log("Stripe public key obtained from Supabase");
      return validateStripeKey(data.key);
    } else {
      console.log("No key found in Supabase, using local environment variable");
      return getLocalStripeKey();
    }
  } catch (error) {
    console.error("Exception fetching Stripe key:", error);
    return getLocalStripeKey();
  }
};

// Função para obter a chave local da variável de ambiente
const getLocalStripeKey = (): string => {
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  return validateStripeKey(stripeKey);
};

// Validar formato da chave
const validateStripeKey = (stripeKey: string | undefined): string => {
  if (!stripeKey) {
    console.error(
      "ERRO: Chave pública do Stripe não encontrada.",
      "Certifique-se de que a chave está definida no Supabase ou como variável de ambiente."
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
  const stripeKey = await getStripePublicKey();
  
  if (!stripeKey) {
    return { 
      valid: false, 
      message: "Chave do Stripe não configurada. Configure a chave no Supabase ou como variável de ambiente." 
    };
  }
  
  if (!stripeKey.startsWith('pk_')) {
    return { 
      valid: false, 
      message: "Formato inválido da chave do Stripe. Deve começar com 'pk_'." 
    };
  }
  
  const isTestKey = stripeKey.startsWith('pk_test_');
  
  return { 
    valid: true, 
    message: `Configuração do Stripe válida. Usando chave ${isTestKey ? 'de teste' : 'de produção'}: ${stripeKey.substring(0, 8)}...` 
  };
};
