import { FinancialTitle } from "@/types/financial";
import { Organization } from "@/types/organization";
import { updateOrganizationStatus } from "./organizationService";

export const createProRataTitle = (organization: Organization, proRataValue: number): FinancialTitle => {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 3); // Vencimento em 3 dias

  return {
    id: Math.random().toString(36).substring(7),
    organizationId: organization.id,
    organizationName: organization.name,
    type: "pro_rata",
    value: proRataValue,
    dueDate: dueDate.toISOString(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
};

export const generateMonthlyTitles = async () => {
  // Em produção, isso seria um job agendado para rodar todo dia 1
  const activeOrganizations: Organization[] = []; // Buscar organizações ativas
  const dueDate = new Date();
  dueDate.setDate(5); // Vencimento dia 5

  const titles: FinancialTitle[] = activeOrganizations.map(org => ({
    id: Math.random().toString(36).substring(7),
    organizationId: org.id,
    organizationName: org.name,
    type: "mensalidade",
    value: 500, // Valor do plano da organização
    dueDate: dueDate.toISOString(),
    status: "pending",
    referenceMonth: new Date().toISOString().substring(0, 7),
    createdAt: new Date().toISOString(),
  }));

  return titles;
};

export const processPayment = async (titleId: string) => {
  // Em produção, implementar a lógica de processamento do pagamento
  console.log("Processando pagamento do título:", titleId);
  return true;
};

// Função para atualizar status do título e da organização após pagamento
export const handleTitlePayment = async (title: FinancialTitle, organization: Organization) => {
  // Atualiza o título para pago
  const updatedTitle = {
    ...title,
    status: "paid" as const,
    paymentDate: new Date().toISOString(),
  };

  // Se for pagamento pro rata, ativa a organização e o usuário admin
  if (title.type === "pro_rata") {
    const adminUser = organization.users.find(user => user.role === "company_admin");
    if (adminUser) {
      adminUser.status = "active";
    }
    organization.status = "active";
    organization.pendingReason = null;
  }

  return updatedTitle;
};

// Função para verificar status do pagamento (mock)
export const checkPaymentStatus = async (organizationId: number): Promise<"pending" | "paid" | "overdue"> => {
  // Aqui implementaríamos a verificação real do status do pagamento
  // Por enquanto, retornamos um status aleatório para demonstração
  const statuses: ("pending" | "paid" | "overdue")[] = ["pending", "paid", "overdue"];
  return statuses[Math.floor(Math.random() * statuses.length)];
};
