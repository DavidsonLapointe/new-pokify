
import * as z from "zod";

export interface Plan {
  id: number | string;
  name: string;
  price: number;
  shortDescription?: string;
  description?: string;
  benefits?: string[];
  features?: string[]; // Optional for backward compatibility
  howItWorks?: string[];
  active: boolean;
  comingSoon?: boolean;
  icon?: string;
  actionButtonText?: string;
  credits?: number | null;
  areas?: string[]; // IDs of company areas associated with this module
  // Support for legacy Stripe properties
  stripeProductId?: string;
  stripePriceId?: string;
}

export const planFormSchema = z.object({
  name: z.string().min(2, {
    message: "O nome precisa ter pelo menos 2 caracteres.",
  }),
  description: z.string().min(10, {
    message: "A descrição precisa ter pelo menos 10 caracteres.",
  }),
  price: z.coerce.number().min(0, {
    message: "O preço deve ser maior ou igual a zero.",
  }),
  shortDescription: z.string().optional(),
  benefits: z.array(z.string()).nonempty({
    message: "Adicione pelo menos um recurso.",
  }),
  active: z.boolean().default(true),
  credits: z.coerce.number().nullable().optional(),
  areas: z.array(z.string()).optional(),
});

export type PlanFormValues = z.infer<typeof planFormSchema>;
