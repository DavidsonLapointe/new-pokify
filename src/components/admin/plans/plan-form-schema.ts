
import * as z from "zod";

export const planFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  price: z.string().regex(/^\d+(\.\d{0,2})?$/, "Preço inválido"),
  shortDescription: z.string().min(10, "Descrição breve deve ter pelo menos 10 caracteres"),
  description: z.string().min(10, "Descrição longa deve ter pelo menos 10 caracteres"),
  benefits: z.string().min(1, "Adicione pelo menos um benefício"),
  howItWorks: z.string().min(1, "Adicione pelo menos um passo de como funciona"),
  active: z.boolean(),
  comingSoon: z.boolean().default(false),
  actionButtonText: z.string().min(2, "O texto do botão de ação deve ter pelo menos 2 caracteres"),
  stripeProductId: z.string().optional(),
  stripePriceId: z.string().optional(),
});

export type PlanFormValues = z.infer<typeof planFormSchema>;

export interface Plan {
  id: number;
  name: string;
  price: number;
  shortDescription: string;
  description: string;
  benefits: string[];
  howItWorks: string[];
  active: boolean;
  comingSoon: boolean;
  actionButtonText: string;
  stripeProductId?: string;
  stripePriceId?: string;
}
