
import * as z from "zod";

export const leadFormSchema = z.object({
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().optional(),
  contactType: z.enum(["phone", "email"]),
  contactValue: z.string().refine((val) => {
    if (!val) return false;
    const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return val.includes("@") ? emailRegex.test(val) : phoneRegex.test(val);
  }, "Contato inválido")
});

export type LeadFormData = z.infer<typeof leadFormSchema>;
