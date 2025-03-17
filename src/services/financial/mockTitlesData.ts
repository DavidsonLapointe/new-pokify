
import { FinancialTitle } from "@/types/financial";

export const mockTitles: FinancialTitle[] = [
  {
    id: "1",
    organizationId: "1",
    type: "mensalidade",
    value: 1000,
    dueDate: "2024-03-25",
    status: "pending",
    referenceMonth: "2024-03-01",
    createdAt: "2024-03-01",
    organization: {
      name: "Empresa A LTDA",
      nome_fantasia: "Empresa A",
      cnpj: "12.345.678/0001-90"
    }
  },
  {
    id: "2",
    organizationId: "2",
    type: "pro_rata",
    value: 500,
    dueDate: "2024-03-20",
    status: "overdue",
    createdAt: "2024-03-01",
    organization: {
      name: "Empresa B Comércio S.A.",
      nome_fantasia: "Empresa B",
      cnpj: "98.765.432/0001-10"
    }
  },
  {
    id: "3",
    organizationId: "3",
    type: "mensalidade",
    value: 750,
    dueDate: "2024-02-15",
    status: "paid",
    paymentDate: "2024-02-15",
    paymentMethod: "pix",
    referenceMonth: "2024-02-01",
    createdAt: "2024-02-01",
    organization: {
      name: "Empresa C Serviços Ltda",
      nome_fantasia: "Empresa C",
      cnpj: "45.678.901/0001-23"
    }
  },
  {
    id: "4",
    organizationId: "1",
    type: "setup",
    value: 2000,
    dueDate: "2024-03-01",
    status: "pending",
    createdAt: "2024-03-01",
    moduleId: "1",
    moduleName: "Chat AI",
    organization: {
      name: "Empresa A LTDA",
      nome_fantasia: "Empresa A",
      cnpj: "12.345.678/0001-90"
    }
  },
  {
    id: "5",
    organizationId: "2",
    type: "setup",
    value: 1500,
    dueDate: "2024-02-20",
    status: "paid",
    paymentDate: "2024-02-18",
    paymentMethod: "credit_card",
    createdAt: "2024-02-15",
    moduleId: "2",
    moduleName: "Análise de Ligações",
    organization: {
      name: "Empresa B Comércio S.A.",
      nome_fantasia: "Empresa B",
      cnpj: "98.765.432/0001-10"
    }
  }
];
