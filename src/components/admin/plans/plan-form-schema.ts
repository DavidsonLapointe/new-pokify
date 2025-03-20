
import * as z from "zod";

export interface Plan {
  id: number | string;
  name: string;
  price: number;
  shortDescription?: string;
  description?: string;
  benefits?: string[];
  howItWorks?: string[];
  active: boolean;
  comingSoon?: boolean;
  icon?: string;
  actionButtonText?: string;
  credits?: number | null;
  areas?: string[]; // IDs of company areas associated with this module
}

export const planFormSchema = z.object({
  name: z.string().min(2, {
    message: "O nome precisa ter pelo menos 2 caracteres.",
  }),
  description: z.string().min(10, {
    message: "A descrição precisa ter pelo menos 10 caracteres.",
  }),
  price: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().min(0, {
      message: "O preço deve ser maior ou igual a zero.",
    })
  ),
  features: z.array(z.string()).nonempty({
    message: "Adicione pelo menos um recurso.",
  }),
  active: z.boolean().default(true),
  credits: z.union([
    z.preprocess(
      (a) => parseInt(z.string().parse(a), 10),
      z.number().min(0).optional()
    ),
    z.literal("").transform(() => undefined),
  ]).optional(),
  areas: z.array(z.string()).optional(),
});

export type PlanFormValues = z.infer<typeof planFormSchema>;

