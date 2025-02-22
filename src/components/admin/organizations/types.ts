
import { z } from "zod";

export const confirmRegistrationSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
  confirmPassword: z.string(),
  logradouro: z.string().min(3, "Logradouro é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(2, "Bairro é obrigatório"),
  cidade: z.string().min(2, "Cidade é obrigatória"),
  estado: z.string().length(2, "Estado deve ter 2 caracteres"),
  cep: z.string().min(8, "CEP inválido"),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "Você deve aceitar os termos de uso"
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"]
});

export type ConfirmRegistrationFormData = z.infer<typeof confirmRegistrationSchema>;
