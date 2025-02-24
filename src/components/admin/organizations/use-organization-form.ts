
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Organization } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { createOrganizationSchema, type CreateOrganizationFormData } from "./schema";
import { useUser } from "@/contexts/UserContext";

export const useOrganizationForm = (onSuccess: () => void) => {
  const { toast } = useToast();
  const { user } = useUser();
  
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
    // Verifica se o usuário tem permissão para criar organizações
    if (user.role !== "leadly_employee") {
      toast({
        title: "Acesso negado",
        description: "Apenas funcionários Leadly podem criar organizações",
        variant: "destructive",
      });
      return;
    }

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
      // Envia o email com o contrato
      const { error: emailError } = await supabase.functions.invoke('send-organization-emails', {
        body: {
          organizationId: newOrganization.id,
          type: 'contract',
          data: {
            contractUrl: `${window.location.origin}/contract/${newOrganization.id}`
          }
        }
      });

      if (emailError) throw emailError;

      toast({
        title: "Empresa criada com sucesso",
        description: "Um email foi enviado para o administrador contendo:",
        children: [
          "Contrato de adesão para assinatura",
          "Link para assinatura digital do contrato",
          "Instruções sobre os próximos passos"
        ].map((text) => (
          `• ${text}`
        )).join("\n")
      });

      form.reset();
      onSuccess();
    } catch (error: any) {
      console.error("Erro ao criar empresa:", error);
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
