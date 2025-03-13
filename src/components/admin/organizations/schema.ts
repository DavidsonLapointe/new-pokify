
import * as z from "zod";
import { OrganizationStatus } from "@/types/organization-types";
import { validateCNPJ } from "@/utils/cnpjValidation";

export const createOrganizationSchema = z.object({
  razaoSocial: z.string().min(2, "A razão social deve ter pelo menos 2 caracteres"),
  nomeFantasia: z.string().min(2, "O nome fantasia deve ter pelo menos 2 caracteres"),
  cnpj: z.string()
    .min(14, "CNPJ inválido")
    .refine((val) => {
      // Use the validation function from the utility
      const isValid = validateCNPJ(val);
      console.log(`CNPJ validation result for ${val}: ${isValid}`);
      return isValid;
    }, {
      message: "CNPJ inválido. Verifique o número informado."
    }),
  plan: z.string().min(1, "Selecione um plano"),
  email: z.string().email("Email da empresa inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  adminName: z.string().min(2, "O nome do administrador deve ter pelo menos 2 caracteres"),
  adminEmail: z.string().email("Email do administrador inválido"),
  status: z.enum(["active", "pending", "suspended", "canceled", "inactive"] as const),
});

export type CreateOrganizationFormData = z.infer<typeof createOrganizationSchema>;
