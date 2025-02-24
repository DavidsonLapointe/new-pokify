
export type TitleType = "pro_rata" | "mensalidade";
export type TitleStatus = "pending" | "paid" | "overdue";
export type PaymentMethod = "pix" | "boleto";

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
}

export interface CreateFinancialTitleDTO {
  organizationId: string;
  type: TitleType;
  value: number;
  dueDate: string;
  referenceMonth?: string;
}
