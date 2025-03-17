
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
  },
  {
    id: "6",
    organizationId: "4",
    type: "mensalidade",
    value: 1200,
    dueDate: "2024-04-01",
    status: "pending",
    referenceMonth: "2024-04-01",
    createdAt: "2024-03-15",
    organization: {
      name: "Empresa D Tecnologia Ltda",
      nome_fantasia: "Empresa D",
      cnpj: "56.789.012/0001-34"
    }
  },
  {
    id: "7",
    organizationId: "5",
    type: "pro_rata",
    value: 350,
    dueDate: "2024-03-25",
    status: "paid",
    paymentDate: "2024-03-24",
    paymentMethod: "boleto",
    createdAt: "2024-03-10",
    organization: {
      name: "Empresa E Distribuidora Ltda",
      nome_fantasia: "Empresa E",
      cnpj: "67.890.123/0001-45"
    }
  },
  {
    id: "8",
    organizationId: "3",
    type: "setup",
    value: 2500,
    dueDate: "2024-03-10",
    status: "overdue",
    createdAt: "2024-02-25",
    moduleId: "3",
    moduleName: "Integração CRM",
    organization: {
      name: "Empresa C Serviços Ltda",
      nome_fantasia: "Empresa C",
      cnpj: "45.678.901/0001-23"
    }
  },
  {
    id: "9",
    organizationId: "4",
    type: "mensalidade",
    value: 1200,
    dueDate: "2024-03-01",
    status: "paid",
    paymentDate: "2024-03-01",
    paymentMethod: "pix",
    referenceMonth: "2024-03-01",
    createdAt: "2024-02-15",
    organization: {
      name: "Empresa D Tecnologia Ltda",
      nome_fantasia: "Empresa D",
      cnpj: "56.789.012/0001-34"
    }
  },
  {
    id: "10",
    organizationId: "5",
    type: "setup",
    value: 1800,
    dueDate: "2024-04-05",
    status: "pending",
    createdAt: "2024-03-20",
    moduleId: "4",
    moduleName: "Dashboard Avançado",
    organization: {
      name: "Empresa E Distribuidora Ltda",
      nome_fantasia: "Empresa E",
      cnpj: "67.890.123/0001-45"
    }
  }
];
