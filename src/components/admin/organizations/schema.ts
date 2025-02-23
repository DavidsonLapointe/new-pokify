import * as z from "zod";

const formSchema = z.object({
  razaoSocial: z.string().min(2, "A razão social deve ter pelo menos 2 caracteres"),
  nomeFantasia: z.string().min(2, "O nome fantasia deve ter pelo menos 2 caracteres"),
  cnpj: z.string().min(14, "CNPJ inválido"),
  plan: z.enum(["basic", "professional", "enterprise"]),
  email: z.string().email("Email da empresa inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  adminName: z.string().min(2, "O nome do administrador deve ter pelo menos 2 caracteres"),
  adminEmail: z.string().email("Email do administrador inválido"),
  status: z.enum(["active", "pending", "inactive"]),
});

export type CreateOrganizationFormData = z.infer<typeof formSchema>;
