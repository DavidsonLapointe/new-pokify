
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
      // Verify user permission
      if (user.role !== "leadly_employee") {
        toast({
          title: "Acesso negado",
          description: "Apenas funcionários Leadly podem criar organizações",
          variant: "destructive",
        });
        return;
      }

      console.log("Iniciando criação da organização:", values);

      // Check if CNPJ exists
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

      // Create organization
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

      // Calculate pro-rata value
      const planValues = {
        basic: 99.90,
        professional: 199.90,
        enterprise: 399.90
      };

      let proRataValue = calculateProRataValue(planValues[values.plan as keyof typeof planValues]);
      proRataValue = parseFloat(proRataValue.toFixed(2));
      
      console.log("Valor pro-rata calculado:", proRataValue);

      try {
        // Create pro-rata title
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
          console.error("Falha ao criar título pro-rata");
        }
        
        // Send contract email
        try {
          console.log("Enviando email do contrato...");
          const { error: emailError } = await supabase.functions.invoke('send-organization-emails', {
            body: {
              organizationId: newOrganizationData.id,
              type: 'contract',
              data: {
                contractUrl: `${window.location.origin}/contract/${newOrganizationData.id}`,
                proRataAmount: proRataValue
              }
            }
          });

          if (emailError) {
            console.error("Erro ao enviar email:", emailError);
            throw emailError;
          }
          
          // Send confirmation email with registration link
          const { error: confirmationEmailError } = await supabase.functions.invoke('send-organization-emails', {
            body: {
              organizationId: newOrganizationData.id,
              type: 'confirmation',
              data: {
                confirmationToken: `${window.location.origin}/confirm-registration/${newOrganizationData.id}`
              }
            }
          });

          if (confirmationEmailError) {
            console.error("Erro ao enviar email de confirmação:", confirmationEmailError);
            throw confirmationEmailError;
          }

          // Send payment instructions email
          const { error: paymentEmailError } = await supabase.functions.invoke('send-organization-emails', {
            body: {
              organizationId: newOrganizationData.id,
              type: 'payment',
              data: {
                paymentUrl: `${window.location.origin}/payment/${newOrganizationData.id}`,
                proRataAmount: proRataValue
              }
            }
          });

          if (paymentEmailError) {
            console.error("Erro ao enviar email de pagamento:", paymentEmailError);
            throw paymentEmailError;
          }

          console.log("Emails enviados com sucesso");
        } catch (emailError) {
          console.error("Erro ao enviar emails:", emailError);
          toast({
            title: "Aviso",
            description: "Empresa criada, mas houve um erro ao enviar os emails. Nossa equipe será notificada.",
            variant: "warning",
          });
          // Continue with success flow even if email fails
        }

        toast({
          title: "Empresa criada com sucesso",
          description: "Um email será enviado para o administrador contendo o contrato e instruções.",
        });

        form.reset();
        onSuccess();
      } catch (error) {
        console.error("Erro ao processar pós-criação da empresa:", error);
        
        toast({
          title: "Empresa criada parcialmente",
          description: "A empresa foi criada, mas houve um erro no processamento. A equipe será notificada.",
          variant: "warning",
        });
        
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
