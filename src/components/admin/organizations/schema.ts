import { z } from "zod";

// Base schema for step 2 (organization details only)
export const organizationDetailsSchema = z.object({
  razaoSocial: z.string().min(3, "Razão social deve ter no mínimo 3 caracteres"),
  nomeFantasia: z.string().min(2, "Nome fantasia deve ter no mínimo 2 caracteres"),
  cnpj: z.string().min(14, "CNPJ inválido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  plan: z.string().min(1, "Selecione um plano"),
  adminName: z.string().min(3, "Nome do administrador deve ter no mínimo 3 caracteres"),
  adminEmail: z.string().email("Email inválido"),
  status: z.enum(["pending", "active", "inactive", "suspended", "canceled"]).default("pending"),
  // Make modules optional in this schema
  modules: z.array(z.string()).optional(),
});

// Full schema for final submission (includes modules validation)
export const organizationSchema = organizationDetailsSchema.extend({
  modules: z.array(z.string()).min(1, "Selecione pelo menos um módulo")
});

export type CreateOrganizationFormData = z.infer<typeof organizationSchema>;
