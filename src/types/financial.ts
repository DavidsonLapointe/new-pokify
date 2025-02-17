
export type TitleType = "pro_rata" | "mensalidade";
export type TitleStatus = "pending" | "paid" | "overdue";

export interface FinancialTitle {
  id: string;
  organizationId: number;
  organizationName: string;
  type: TitleType;
  value: number;
  dueDate: string;
  status: TitleStatus;
  referenceMonth?: string; // Para títulos do tipo mensalidade
  paymentDate?: string;
  paymentMethod?: "pix" | "boleto";
  createdAt: string;
}
