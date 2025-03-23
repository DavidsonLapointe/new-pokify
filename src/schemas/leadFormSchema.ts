
import * as z from "zod";
import { LeadType } from "@/components/calls/utils";

export const leadFormSchema = z.object({
  personType: z.enum(["pf", "pj"]),
  leadType: z.string().min(1, "Tipo de lead é obrigatório"),
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
}).superRefine((data, ctx) => {
  if (data.personType === "pf" && !data.email) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Email é obrigatório para Pessoa Física",
      path: ["email"],
    });
  }

  if (data.personType === "pj") {
    if (!data.razaoSocial || !data.cnpj) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Razão Social e CNPJ são obrigatórios para Pessoa Jurídica",
        path: ["razaoSocial"],
      });
    }
  }
});

export type LeadFormData = z.infer<typeof leadFormSchema>;
