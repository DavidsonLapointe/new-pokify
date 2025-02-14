
import * as z from "zod";

export const leadFormSchema = z.object({
  personType: z.enum(["pf", "pj"]),
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().optional(),
  contactType: z.enum(["phone", "email"]),
  contactValue: z.string().refine((val) => {
    if (!val) return false;
    const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return val.includes("@") ? emailRegex.test(val) : phoneRegex.test(val);
  }, "Contato inválido"),
  // Campos PF
  cpf: z.string().optional(),
  // Campos PJ
  razaoSocial: z.string().optional(),
  nomeFantasia: z.string().optional(),
  cnpj: z.string().optional(),
  // Endereço
  endereco: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;
