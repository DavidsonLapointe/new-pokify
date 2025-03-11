
import { useFormErrorHandlers } from "../utils/form-error-handlers";
import { useUser } from "@/contexts/UserContext";
import { type CreateOrganizationFormData } from "../schema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { OrganizationPendingReason, type OrganizationStatus } from "@/types/organization-types";

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

      // Define the organization status and pending reason
      const status: OrganizationStatus = "pending";
      const pendingReason: OrganizationPendingReason = "user_validation";

      // Prepare organization data with correct typing for the database
      const insertData = {
        name: values.razaoSocial,
        nome_fantasia: values.nomeFantasia,
        email: values.adminEmail,
        phone: values.phone,
        cnpj: values.cnpj,
        admin_name: values.adminName,
        admin_email: values.adminEmail,
        admin_phone: values.adminPhone,
        plan: values.plan,
        status,
        contract_status: 'pending',
        payment_status: 'pending',
        registration_status: 'pending',
        pending_reason: pendingReason
      };

      console.log("Dados de inserção preparados:", insertData);
      
      const { data: newOrganization, error: insertError } = await supabase
        .from('organizations')
        .insert([insertData])
        .select()
        .single();
        
      if (insertError) {
        console.error("Erro ao criar organização:", insertError);
        errorHandlers.handleDatabaseConfigError();
        return;
      }
      
      console.log("Organização criada com sucesso:", newOrganization);
      
      // Send onboarding email to the organization's administrator
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
          
          if (response.data && response.data.status === 'warning') {
            if (response.data.details && response.data.details.includes('problematic email domain')) {
              const domain = newOrganization.admin_email.split('@')[1];
              errorHandlers.handleEmailProviderIssue(domain);
            } else {
              errorHandlers.handleEmailError(response.data.message || "Erro ao enviar email");
            }
          }
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
