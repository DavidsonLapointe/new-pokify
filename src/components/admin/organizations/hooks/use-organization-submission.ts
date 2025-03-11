
import { useFormErrorHandlers } from "../utils/form-error-handlers";
import { useUser } from "@/contexts/UserContext";
import { type CreateOrganizationFormData } from "../schema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { type OrganizationStatus, type OrganizationPendingReason } from "@/types/organization-types";

export const useOrganizationSubmission = (onSuccess: () => void) => {
  const { user } = useUser();
  const errorHandlers = useFormErrorHandlers();

  const handleSubmit = async (values: CreateOrganizationFormData) => {
    try {
      console.log("Processando submissão do formulário de organização:", values);
      
      if (user.role !== "leadly_employee") {
        errorHandlers.handlePermissionError();
        return;
      }

      // Verificar se já existe organização com este CNPJ
      const { data: existingOrg, error: checkError } = await supabase
        .from('organizations')
        .select('id, cnpj')
        .eq('cnpj', values.cnpj)
        .maybeSingle();

      if (checkError) {
        console.error("Erro ao verificar CNPJ existente:", checkError);
        errorHandlers.handleDatabaseConfigError();
        return;
      }

      if (existingOrg) {
        console.log("CNPJ já existente:", existingOrg);
        errorHandlers.handleCnpjExistsError();
        return;
      }

      // Dados básicos da organização - sem nenhuma tipagem complexa
      const organizationData = {
        name: values.razaoSocial,
        nome_fantasia: values.nomeFantasia,
        email: values.adminEmail,
        phone: values.phone,
        cnpj: values.cnpj,
        admin_name: values.adminName,
        admin_email: values.adminEmail,
        admin_phone: values.adminPhone,
        plan: values.plan,
        // Valores de status simples, sem tipagem complexa
        status: 'pending',
        contract_status: 'pending',
        payment_status: 'pending',
        registration_status: 'pending',
        pending_reason: 'user_validation'
      };

      console.log("Dados simplificados para inserção:", organizationData);
      
      // Inserção simplificada
      const { data: newOrganization, error: insertError } = await supabase
        .from('organizations')
        .insert([organizationData])
        .select()
        .single();
        
      if (insertError) {
        console.error("Erro detalhado ao criar organização:", insertError);
        
        // Log mais detalhado para ajudar no diagnóstico
        if (insertError.code) {
          console.error(`Código do erro: ${insertError.code}`);
        }
        if (insertError.message) {
          console.error(`Mensagem do erro: ${insertError.message}`);
        }
        if (insertError.details) {
          console.error(`Detalhes do erro: ${insertError.details}`);
        }
        
        errorHandlers.handleDatabaseConfigError();
        return;
      }
      
      console.log("Organização criada com sucesso:", newOrganization);
      
      // Enviar email de onboarding
      try {
        console.log("Iniciando envio de e-mail de onboarding para:", newOrganization.admin_email);
        
        const confirmationToken = `${window.location.origin}/setup/${newOrganization.id}`;
        
        const response = await supabase.functions.invoke('send-organization-emails', {
          body: {
            organizationId: newOrganization.id,
            type: "onboarding",
            data: {
              confirmationToken
            }
          }
        });
        
        if (response.error) {
          console.error("Erro ao enviar e-mail de onboarding:", response.error);
          errorHandlers.handleEmailError(response.error);
        } else {
          console.log("Resposta do envio de email:", response.data);
        }
      } catch (emailError) {
        console.error("Erro inesperado ao enviar e-mail:", emailError);
        errorHandlers.handleEmailError(emailError);
      }
      
      errorHandlers.showSuccessToast();
      onSuccess();

    } catch (error: any) {
      console.error("Erro inesperado durante a criação:", error);
      errorHandlers.handleUnexpectedError(error);
    }
  };

  return {
    handleSubmit
  };
};
