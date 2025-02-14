
import * as z from "zod";

export const leadFormSchema = z.object({
  personType: z.enum(["pf", "pj"]),
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().optional(),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return /^\(\d{2}\) \d{4,5}-\d{4}$/.test(val);
      },
      { message: "Telefone inválido" }
    ),
  email: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      },
      { message: "Email inválido" }
    ),
  cpf: z.string().optional(),
  razaoSocial: z.string().optional(),
  nomeFantasia: z.string().optional(),
  cnpj: z.string().optional(),
  endereco: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;
