import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Organization } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { createOrganizationSchema, type CreateOrganizationFormData } from "./schema";
import { useUser } from "@/contexts/UserContext";
import { createProRataTitle } from "@/services/financialService";

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

  const calculateProRataValue = (planValue: number): number => {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const remainingDays = daysInMonth - today.getDate();
    return (planValue / daysInMonth) * remainingDays;
  };

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

    try {
      // Cria a organização primeiro
      const { data: newOrganizationData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: values.razaoSocial,
          nome_fantasia: values.nomeFantasia,
          plan: values.plan,
          status: "pending",
          pending_reason: "contract_signature",
          email: values.email,
          phone: values.phone,
          cnpj: values.cnpj,
          admin_name: values.adminName,
          admin_email: values.adminEmail,
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // Mapeia os dados do Supabase para o tipo Organization
      const newOrganization: Organization = {
        id: String(newOrganizationData.id),
        name: newOrganizationData.name,
        nomeFantasia: newOrganizationData.nome_fantasia || "",
        plan: newOrganizationData.plan,
        users: [], // Inicialmente vazio
        status: newOrganizationData.status,
        pendingReason: newOrganizationData.pending_reason === "null" ? null : newOrganizationData.pending_reason || null,
        integratedCRM: newOrganizationData.integrated_crm,
        integratedLLM: newOrganizationData.integrated_llm,
        email: newOrganizationData.email,
        phone: newOrganizationData.phone || "",
        cnpj: newOrganizationData.cnpj,
        adminName: newOrganizationData.admin_name,
        adminEmail: newOrganizationData.admin_email,
        contractSignedAt: newOrganizationData.contract_signed_at,
        createdAt: newOrganizationData.created_at || new Date().toISOString(),
        logo: newOrganizationData.logo,
        address: newOrganizationData.logradouro ? {
          logradouro: newOrganizationData.logradouro,
          numero: newOrganizationData.numero || "",
          complemento: newOrganizationData.complemento || "",
          bairro: newOrganizationData.bairro || "",
          cidade: newOrganizationData.cidade || "",
          estado: newOrganizationData.estado || "",
          cep: newOrganizationData.cep || "",
        } : undefined
      };

      // Calcula o valor pro-rata baseado no plano
      const planValues = {
        basic: 99.90,
        professional: 199.90,
        enterprise: 399.90
      };

      const proRataValue = calculateProRataValue(planValues[values.plan as keyof typeof planValues]);

      // Cria o título pro-rata
      const proRataTitle = await createProRataTitle(newOrganization, proRataValue);

      if (!proRataTitle) {
        throw new Error("Falha ao criar título pro-rata");
      }

      // Envia o email com o contrato
      const { error: emailError } = await supabase.functions.invoke('send-organization-emails', {
        body: {
          organizationId: newOrganization.id,
          type: 'contract',
          data: {
            contractUrl: `${window.location.origin}/contract/${newOrganization.id}`,
            proRataValue: proRataTitle.value
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
          `Título pro-rata no valor de R$ ${proRataValue.toFixed(2)}`,
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
        description: "Não foi possível criar a empresa. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return {
    form,
    onSubmit,
  };
};
