
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
    .refine(
      (val) => {
        if (!val) return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      },
      { message: "Email inválido" }
    ),
  cpf: z.string().optional(),
  razaoSocial: z.string(),
  nomeFantasia: z.string().optional(),
  cnpj: z.string(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
}).refine(
  (data) => {
    if (data.personType === "pf") {
      // Para PF: email é obrigatório
      return Boolean(data.email);
    } else {
      // Para PJ: razaoSocial e cnpj são obrigatórios
      return Boolean(data.razaoSocial) && Boolean(data.cnpj);
    }
  },
  {
    message: (data) => {
      if (data.personType === "pf") {
        return "Email é obrigatório para Pessoa Física";
      } else {
        return "Razão Social e CNPJ são obrigatórios para Pessoa Jurídica";
      }
    },
    path: ["email"], // Para PF o erro aparece no campo email
  }
);

export type LeadFormData = z.infer<typeof leadFormSchema>;

