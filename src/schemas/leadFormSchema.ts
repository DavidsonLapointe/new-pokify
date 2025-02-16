
import * as z from "zod";

export const leadFormSchema = z.object({
  personType: z.enum(["pf", "pj"]),
  firstName: z.string().optional(),
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
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
}).refine(
  (data) => {
    // Pelo menos um meio de contato deve estar preenchido
    return Boolean(data.phone) || Boolean(data.email);
  },
  {
    message: "É necessário fornecer pelo menos um meio de contato (telefone ou email)",
    path: ["phone"], // Mostra o erro no campo telefone por padrão
  }
);

export type LeadFormData = z.infer<typeof leadFormSchema>;
