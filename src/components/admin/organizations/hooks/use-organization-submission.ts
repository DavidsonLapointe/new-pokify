
import { useFormErrorHandlers } from "../utils/form-error-handlers";
import { useUser } from "@/contexts/UserContext";
import { type CreateOrganizationFormData } from "../schema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { OrganizationPendingReason } from "@/types/organization-types";

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

      // Prepare organization data with correct typing
      const insertData = {
        name: values.razaoSocial,
        nome_fantasia: values.nomeFantasia,
        plan: values.plan,
        status: "pending" as const,
        phone: values.phone,
        cnpj: values.cnpj,
        admin_name: values.adminName,
        admin_email: values.adminEmail,
        admin_phone: values.adminPhone,
        email: values.adminEmail,
        contract_status: 'pending' as const,
        payment_status: 'pending' as const,
        registration_status: 'pending' as const,
        pending_reason: 'user_validation' as OrganizationPendingReason
      };

      console.log("Dados de inserção preparados:", insertData);
      
      const { data: newOrganization, error: insertError } = await supabase
        .from('organizations')
        .insert(insertData)
        .select()
        .single();
        
      if (insertError) {
        console.error("Erro ao criar organização:", insertError);
        
        if (insertError.code === "23505" && 
            insertError.message && 
            insertError.message.includes("organizations_cnpj_key")) {
          errorHandlers.handleCnpjExistsError();
        } else {
          errorHandlers.handleOrganizationCreationError(insertError);
        }
        return;
      }
      
      console.log("Organização criada com sucesso:", newOrganization);
      
      // Enviar e-mail de onboarding para o administrador da organização
      try {
        console.log("Iniciando envio de e-mail de onboarding para:", newOrganization.admin_email);
        
        // Gerar token de confirmação para o link de cadastro
        const confirmationToken = `${window.location.origin}/setup/${newOrganization.id}`;
        
        const { data: emailResponse, error: emailError } = await supabase.functions.invoke('send-organization-emails', {
          body: {
            organizationId: newOrganization.id,
            type: "onboarding",
            data: {
              confirmationToken
            }
          }
        });
        
        if (emailError) {
          console.error("Erro ao enviar e-mail de onboarding:", emailError);
          toast.error("Empresa criada, mas houve um erro ao enviar o e-mail de onboarding");
        } else {
          console.log("E-mail de onboarding enviado com sucesso:", emailResponse);
          toast.success("Empresa criada e e-mail de onboarding enviado com sucesso!");
        }
      } catch (emailError) {
        console.error("Erro inesperado ao enviar e-mail:", emailError);
        toast.error("Empresa criada, mas houve um erro ao enviar o e-mail");
      }
      
      toast.success("Empresa criada com sucesso!");
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
