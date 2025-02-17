
import * as z from "zod";

export const planFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  price: z.string().regex(/^\d+(\.\d{0,2})?$/, "Preço inválido"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  features: z.string().min(1, "Adicione pelo menos um recurso"),
  active: z.boolean(),
});

export type PlanFormValues = z.infer<typeof planFormSchema>;

export interface Plan {
  id: number;
  name: string;
  price: number;
  description: string;
  features: string[];
  active: boolean;
}
