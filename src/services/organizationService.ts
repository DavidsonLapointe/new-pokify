
import { Organization, OrganizationPendingReason } from "@/types/organization";

// Função para gerar o contrato de adesão (mock)
const generateContract = (organization: Organization) => {
  return {
    contractId: Math.random().toString(36).substring(7),
    content: `Contrato de Adesão - ${organization.name}`,
    generatedAt: new Date().toISOString(),
  };
};

// Função para calcular o valor pro rata baseado na data de assinatura do contrato
export const calculateProRataValue = (planValue: number, contractSignedDate: Date) => {
  const today = contractSignedDate;
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const remainingDays = daysInMonth - today.getDate();
  return (planValue / daysInMonth) * remainingDays;
};

// Função para gerar dados de pagamento com vencimento em 2 dias
const generatePaymentData = (organization: Organization, proRataValue: number) => {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 2);

  return {
    pix: {
      key: "00000000-0000-0000-0000-000000000000",
      value: proRataValue,
    },
    boleto: {
      code: "00000000000000000000000000000000000000000000000",
      value: proRataValue,
      dueDate: dueDate.toISOString(),
    },
  };
};

// Função para enviar o contrato inicial
export const sendInitialContract = async (organization: Organization) => {
  const contract = generateContract(organization);

  console.log("Enviando contrato inicial para:", organization.adminEmail, {
    subject: "Bem-vindo(a) à Plataforma - Contrato de Adesão",
    attachments: ["contrato.pdf"],
    content: {
      contract,
      message: "Por favor, assine o contrato para continuar o processo de ativação.",
    },
  });

  return true;
};

// Função para enviar instruções de pagamento pro rata
export const sendProRataPaymentInstructions = async (organization: Organization, proRataValue: number) => {
  const paymentData = generatePaymentData(organization, proRataValue);

  console.log("Enviando instruções de pagamento pro rata para:", organization.adminEmail, {
    subject: "Instruções de Pagamento - Valor Pro Rata",
    content: {
      paymentData,
      message: "Para ativar sua conta, efetue o pagamento do valor pro rata.",
    },
  });

  return true;
};

// Função para enviar link de configuração inicial
export const sendSetupLink = async (organization: Organization) => {
  const setupToken = Math.random().toString(36).substring(7);
  
  console.log("Enviando link de configuração para:", organization.adminEmail, {
    subject: "Configure seu acesso à Plataforma",
    content: {
      setupUrl: `https://app.example.com/setup/${setupToken}`,
      message: "Clique no link para configurar sua senha e método de pagamento.",
    },
  });

  return true;
};

// Função para atualizar status da organização
export const updateOrganizationStatus = async (
  organizationId: number, 
  status: "active" | "pending" | "inactive",
  pendingReason?: OrganizationPendingReason
) => {
  console.log("Atualizando status da organização:", organizationId, status, pendingReason);
  return true;
};

// Função para verificar status da organização por email
export const checkOrganizationStatus = async (email: string) => {
  return {
    status: "pending" as const,
    pendingReason: "contract_signature" as OrganizationPendingReason,
    email: email,
    organizationId: 1,
  };
};
