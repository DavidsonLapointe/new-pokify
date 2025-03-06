
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
    try {
      // Verifica se o usuário tem permissão para criar organizações
      if (user.role !== "leadly_employee") {
        toast({
          title: "Acesso negado",
          description: "Apenas funcionários Leadly podem criar organizações",
          variant: "destructive",
        });
        return;
      }

      console.log("Iniciando criação da organização:", values);

      // Verifica se o CNPJ já existe
      const { data: existingOrg, error: checkError } = await supabase
        .from('organizations')
        .select('id')
        .eq('cnpj', values.cnpj)
        .maybeSingle();

      if (checkError) {
        console.error("Erro ao verificar CNPJ existente:", checkError);
      }

      if (existingOrg) {
        toast({
          title: "CNPJ já cadastrado",
          description: "Já existe uma empresa cadastrada com este CNPJ.",
          variant: "destructive",
        });
        return;
      }

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

      if (orgError) {
        console.error("Erro ao criar organização:", orgError);
        let errorMessage = "Não foi possível criar a empresa.";
        
        if (orgError.code === "23505" && orgError.message.includes("organizations_cnpj_key")) {
          errorMessage = "CNPJ já cadastrado no sistema.";
        }
        
        toast({
          title: "Erro ao criar empresa",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      console.log("Organização criada com sucesso:", newOrganizationData);

      // Calcula o valor pro-rata baseado no plano
      const planValues = {
        basic: 99.90,
        professional: 199.90,
        enterprise: 399.90
      };

      let proRataValue = calculateProRataValue(planValues[values.plan as keyof typeof planValues]);
      proRataValue = parseFloat(proRataValue.toFixed(2)); // Arredonda para 2 casas decimais
      
      console.log("Valor pro-rata calculado:", proRataValue);

      try {
        // Cria o título pro-rata
        const proRataTitle = await createProRataTitle({
          id: String(newOrganizationData.id),
          name: newOrganizationData.name,
          // Incluindo todas as propriedades necessárias para evitar erros
          nomeFantasia: newOrganizationData.nome_fantasia || "",
          plan: newOrganizationData.plan,
          users: [],
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
        }, proRataValue);

        console.log("Título pro-rata criado:", proRataTitle);

        if (!proRataTitle) {
          throw new Error("Falha ao criar título pro-rata");
        }
        
        // Tenta enviar o email com o contrato
        try {
          console.log("Tentando enviar email do contrato...");
          await supabase.functions.invoke('send-organization-emails', {
            body: {
              organizationId: newOrganizationData.id,
              type: 'contract',
              data: {
                contractUrl: `${window.location.origin}/contract/${newOrganizationData.id}`,
                proRataValue: proRataValue
              }
            }
          });
          console.log("Email enviado com sucesso");
        } catch (emailError) {
          console.error("Erro ao enviar email:", emailError);
          // Continua mesmo se o email falhar, apenas loga o erro
        }

        toast({
          title: "Empresa criada com sucesso",
          description: "Um email será enviado para o administrador contendo o contrato e instruções.",
        });

        form.reset();
        onSuccess();
      } catch (error) {
        console.error("Erro ao processar pós-criação da empresa:", error);
        
        // A organização foi criada, mas houve erro no título ou email
        toast({
          title: "Empresa criada parcialmente",
          description: "A empresa foi criada, mas houve um erro no processamento financeiro. A equipe será notificada.",
        });
        
        // Ainda fechamos o modal para mostrar que a empresa foi criada
        form.reset();
        onSuccess();
      }
    } catch (error: any) {
      console.error("Erro não tratado ao criar empresa:", error);
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
