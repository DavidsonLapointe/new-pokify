
import * as z from "zod";

// Schema para validação do formulário de módulo
export const moduleFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  price: z.string().regex(/^\d+(\.\d{0,2})?$/, "Preço inválido"),
  shortDescription: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  description: z.string().min(30, "Descrição completa deve ter pelo menos 30 caracteres"),
  benefits: z.string().min(1, "Adicione pelo menos um benefício"),
  howItWorks: z.string().min(1, "Adicione pelo menos uma etapa de como funciona"),
  active: z.boolean(),
  comingSoon: z.boolean().optional(),
  icon: z.string().optional(),
  actionButtonText: z.string().optional(),
  credits: z.number().nullable().optional(),
  areas: z.array(z.string()).default([]),
});

export type ModuleFormValues = z.infer<typeof moduleFormSchema>;

// Interface to represent a company area
export interface CompanyArea {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
}

// Standard areas that are available in the system
export const standardAreas: CompanyArea[] = [
  { id: "1", name: "Financeiro", description: "Área responsável pelas finanças da empresa", isDefault: true },
  { id: "2", name: "Recursos Humanos", description: "Área responsável pela gestão de pessoas", isDefault: true },
  { id: "3", name: "Contabilidade", description: "Área responsável pela contabilidade da empresa", isDefault: true },
  { id: "4", name: "Marketing", description: "Área responsável pelo marketing da empresa", isDefault: true },
  { id: "5", name: "Vendas", description: "Área responsável pelas vendas da empresa", isDefault: true },
  { id: "6", name: "Controladoria", description: "Área responsável pelo controle financeiro da empresa", isDefault: true },
  { id: "7", name: "Logística", description: "Área responsável pela logística da empresa", isDefault: true },
  { id: "8", name: "Jurídico", description: "Área responsável pelos assuntos jurídicos da empresa", isDefault: true },
  { id: "9", name: "PERA", description: "Área de Pesquisa e Recursos Avançados", isDefault: false },
];
