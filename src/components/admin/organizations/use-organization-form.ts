
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Organization } from "@/types";
import { sendInitialContract } from "@/services/organizationService";
import { createOrganizationSchema, type CreateOrganizationFormData } from "./schema";

export const useOrganizationForm = (onSuccess: () => void) => {
  const { toast } = useToast();
  
  const form = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      razaoSocial: "",
      nomeFantasia: "",
      cnpj: "",
      email: "",
      phone: "",
      plan: "professional",
      adminName: "",
      adminEmail: "",
      status: "pending",
    },
  });

  const onSubmit = async (values: CreateOrganizationFormData) => {
    // Define as permissões para o admin inicial
    const adminPermissions: string[] = [
      "dashboard",
      "leads",
      "integrations",
      "settings",
      "users",
      "plan",
      "profile",
      "company"
    ];

    // Cria a organização primeiro
    const newOrganization: Organization = {
      id: Math.random(),
      name: values.razaoSocial,
      nomeFantasia: values.nomeFantasia,
      plan: values.plan,
      users: [], // Inicialmente vazio
      status: "pending",
      pendingReason: "contract_signature",
      integratedCRM: null,
      integratedLLM: null,
      email: values.email,
      phone: values.phone,
      cnpj: values.cnpj,
      adminName: values.adminName,
      adminEmail: values.adminEmail,
      createdAt: new Date().toISOString(),
    };

    // Cria o usuário admin inicial
    const adminUser = {
      id: 1,
      name: values.adminName,
      email: values.adminEmail,
      phone: values.phone,
      role: "admin" as const,
      status: "pending" as const,
      createdAt: new Date().toISOString(),
      lastAccess: new Date().toISOString(),
      permissions: adminPermissions,
      logs: [],
      organization: newOrganization, // Referência à organização
      avatar: "",
    };

    // Adiciona o usuário admin à organização
    newOrganization.users = [adminUser];

    try {
      await sendInitialContract(newOrganization);

      toast({
        title: "Empresa criada com sucesso",
        description: "Um email foi enviado para o administrador contendo:",
        children: [
          "Contrato de adesão para assinatura",
          "Link para assinatura digital do contrato",
          "Instruções sobre os próximos passos"
        ].map((text, index) => (
          `• ${text}`
        )).join("\n")
      });

      form.reset();
      onSuccess();
    } catch (error) {
      toast({
        title: "Erro ao criar empresa",
        description: "Não foi possível enviar o email com o contrato. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return {
    form,
    onSubmit,
  };
};
