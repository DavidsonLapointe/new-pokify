
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Organization } from "@/types/organization";
import { sendInitialContract } from "@/services/organizationService";
import { createOrganizationSchema, type CreateOrganizationFormData } from "./schema";
import { availableRoutePermissions } from "@/types/permissions";

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
    },
  });

  const onSubmit = async (values: CreateOrganizationFormData) => {
    // Gera as permissões para o admin inicial
    const adminPermissions: { [key: string]: string[] } = {};
    
    // Para cada rota disponível, adiciona todas as suas tabs como permissões
    availableRoutePermissions.forEach(route => {
      // Exclui rotas administrativas e a rota 'calls' que foi removida
      if (!['organizations', 'companies', 'analysis_packages', 'financial', 'prompt', 'calls'].includes(route.id)) {
        adminPermissions[route.id] = route.tabs?.map(tab => tab.value) || [];
      }
    });

    const newOrganization: Organization = {
      id: Math.random(),
      name: values.razaoSocial,
      nomeFantasia: values.nomeFantasia,
      plan: values.plan,
      users: [{
        id: 1,
        name: values.adminName,
        email: values.adminEmail,
        phone: values.phone,
        role: "admin",
        status: "pending",
        createdAt: new Date().toISOString(),
        lastAccess: new Date().toISOString(),
        permissions: adminPermissions,
        logs: [],
        organization: {} as Organization, // Será atualizado após a criação
        avatar: "",
      }],
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
