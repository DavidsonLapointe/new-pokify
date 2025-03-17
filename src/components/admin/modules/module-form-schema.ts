
import * as z from "zod";

// Schema para validação do formulário de módulo
export const moduleFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  price: z.string().regex(/^\d+(\.\d{0,2})?$/, "Preço inválido"),
  shortDescription: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  description: z.string().min(30, "Descrição completa deve ter pelo menos 30 caracteres"),
  benefits: z.string().min(1, "Adicione pelo menos um benefício"),
  howItWorks: z.string().min(1, "Adicione pelo menos uma etapa de como funciona"),
  active: z.boolean(),
  comingSoon: z.boolean().optional(),
  icon: z.string().optional(),
  actionButtonText: z.string().optional(),
  credits: z.number().nullable().optional(),
});

export type ModuleFormValues = z.infer<typeof moduleFormSchema>;
