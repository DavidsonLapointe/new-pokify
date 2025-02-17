
import { Organization } from "@/types/organization";

// Função para gerar o contrato de adesão (mock)
const generateContract = (organization: Organization) => {
  return {
    contractId: Math.random().toString(36).substring(7),
    content: `Contrato de Adesão - ${organization.name}`,
    generatedAt: new Date().toISOString(),
  };
};

// Função para calcular o valor pro rata
const calculateProRataValue = (planValue: number) => {
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const remainingDays = daysInMonth - today.getDate();
  return (planValue / daysInMonth) * remainingDays;
};

// Função para gerar dados de pagamento
const generatePaymentData = (organization: Organization, proRataValue: number) => {
  // Mock de dados de pagamento
  const pixKey = "00000000-0000-0000-0000-000000000000";
  const boletoCode = "00000000000000000000000000000000000000000000000";

  return {
    pix: {
      key: pixKey,
      value: proRataValue,
    },
    boleto: {
      code: boletoCode,
      value: proRataValue,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 dias
    },
  };
};

// Função para enviar email com contrato e instruções de pagamento (mock)
export const sendWelcomeEmail = async (organization: Organization) => {
  const contract = generateContract(organization);
  const proRataValue = calculateProRataValue(1000); // Exemplo: plano de R$1000
  const paymentData = generatePaymentData(organization, proRataValue);

  console.log("Enviando email para:", organization.adminEmail, {
    subject: "Bem-vindo(a) à Plataforma - Instruções de Acesso",
    attachments: ["contrato.pdf"],
    content: {
      contract,
      paymentData,
      accessInstructions: "Após confirmação do pagamento, você receberá as credenciais de acesso.",
    },
  });

  return true;
};

// Função para verificar status do pagamento (mock)
export const checkPaymentStatus = async (organizationId: number): Promise<"pending" | "paid" | "overdue"> => {
  // Aqui implementaríamos a verificação real do status do pagamento
  // Por enquanto, retornamos um status aleatório para demonstração
  const statuses: ("pending" | "paid" | "overdue")[] = ["pending", "paid", "overdue"];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

// Função para atualizar status da organização
export const updateOrganizationStatus = async (
  organizationId: number, 
  status: "active" | "pending" | "inactive"
) => {
  console.log("Atualizando status da organização:", organizationId, status);
  return true;
};

// Função para verificar status da organização por email
export const checkOrganizationStatus = async (email: string) => {
  // Aqui implementaríamos a consulta real ao banco de dados
  // Por enquanto, retornamos um mock
  return {
    status: "pending" as const,
    email: email,
    organizationId: 1,
  };
};
