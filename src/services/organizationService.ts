
import { Organization, OrganizationPendingReason } from "@/types/organization";
import { createProRataTitle, handleTitlePayment } from "./financialService";

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

// Nova função para processar a assinatura do contrato
export const processContractSignature = async (organization: Organization) => {
  try {
    // Atualiza a data de assinatura do contrato
    organization.contractSignedAt = new Date().toISOString();

    // Calcula o valor pro rata
    const proRataValue = calculateProRataValue(500, new Date()); // 500 é o valor base do plano

    // Cria o título pro rata
    const proRataTitle = createProRataTitle(organization, proRataValue);

    // Atualiza o status da organização
    await updateOrganizationStatus(
      organization.id,
      "pending",
      "pro_rata_payment"
    );

    // Envia as instruções de pagamento
    await sendProRataPaymentInstructions(organization, proRataValue);

    return { success: true, proRataValue };
  } catch (error) {
    console.error("Erro ao processar assinatura do contrato:", error);
    throw error;
  }
};

// Nova função para processar a ativação após o pagamento
export const processActivation = async (organization: Organization) => {
  try {
    // Atualiza o status da organização para ativo
    await updateOrganizationStatus(organization.id, "active");

    // Atualiza o status do usuário admin para ativo
    const adminUser = organization.users.find(
      (user) => user.role === "admin" && user.email === organization.adminEmail
    );

    if (adminUser) {
      adminUser.status = "active";
    }

    // Envia o email de boas-vindas
    console.log("Enviando email de boas-vindas para:", organization.adminEmail);

    return true;
  } catch (error) {
    console.error("Erro ao processar ativação:", error);
    throw error;
  }
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
