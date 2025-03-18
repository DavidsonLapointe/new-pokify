
import * as z from "zod";

export const planFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  price: z.string().regex(/^\d+(\.\d{0,2})?$/, "Preço inválido"),
  shortDescription: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  benefits: z.string().min(1, "Adicione pelo menos um recurso"),
  active: z.boolean(),
  credits: z.number().nullable().optional(),
  stripeProductId: z.string().optional(),
  stripePriceId: z.string().optional(),
});

export type PlanFormValues = z.infer<typeof planFormSchema>;

export interface Plan {
  id: number;
  name: string;
  price: number;
  shortDescription: string;
  description?: string;
  benefits: string[];
  active: boolean;
  stripeProductId?: string;
  stripePriceId?: string;
  credits?: number | null;
  // Propriedades adicionais utilizadas no módulo AdminModules
  features?: string[];
  howItWorks?: string[];
  comingSoon?: boolean;
  actionButtonText?: string;
  icon?: string;
  // Adicionando a propriedade status para o módulo
  status?: "not_contracted" | "contracted" | "configured" | "coming_soon" | "setup";
}
