
export type TitleType = "pro_rata" | "mensalidade" | "setup";
export type TitleStatus = "pending" | "paid" | "overdue";
export type PaymentMethod = "pix" | "boleto" | "credit_card";

export interface FinancialTitle {
  id: string;
  organizationId: string;
  type: TitleType;
  value: number;
  dueDate: string;
  status: TitleStatus;
  referenceMonth?: string;
  paymentDate?: string;
  paymentMethod?: PaymentMethod;
  createdAt: string;
  paymentStatusDetails?: string;
  moduleId?: string | number;
  moduleName?: string;
  organization?: {
    name: string;
    nome_fantasia: string | null;
    cnpj: string;
  };
}

export interface CreateFinancialTitleDTO {
  organizationId: string;
  type: TitleType;
  value: number;
  dueDate: string;
  referenceMonth?: string;
  moduleId?: string | number;
}

export interface PaymentOptions {
  pixQrCode?: string;
  pixExpirationDate?: string;
  boletoUrl?: string;
  boletoBarcode?: string;
  clientSecret?: string;
}
