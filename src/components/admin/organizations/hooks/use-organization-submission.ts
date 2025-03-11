
import { useFormErrorHandlers } from "../utils/form-error-handlers";
import { useUser } from "@/contexts/UserContext";
import { type CreateOrganizationFormData } from "../schema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { type OrganizationStatus, type OrganizationPendingReason } from "@/types/organization-types";

// Helper functions for type validation
const correctedStatus = (status: string): OrganizationStatus => {
  return ["active", "inactive", "pending"].includes(status) 
    ? status as OrganizationStatus 
    : "pending";
};

const correctedPendingReason = (reason: string | null): OrganizationPendingReason => {
  const validReasons = ["contract_signature", "mensalidade_payment", "user_validation", null];
  return validReasons.includes(reason) 
    ? reason as OrganizationPendingReason 
    : "user_validation";
};

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
      
      // Dados da organização com validação de tipos
      const organizationData = {
        name: values.razaoSocial,
        nome_fantasia: values.nomeFantasia,
        email: values.adminEmail,
        phone: values.phone,
        cnpj: values.cnpj,
        admin_name: values.adminName,
        admin_email: values.adminEmail,
        admin_phone: values.adminPhone || "",
        plan: values.plan,
        status: "pending" as OrganizationStatus,
        contract_status: "pending",
        payment_status: "pending",
        registration_status: "pending",
        pending_reason: "user_validation" as OrganizationPendingReason
      };

      console.log("Dados formatados para inserção:", organizationData);
      
      // Inserir registros um por um para evitar problemas com ON CONFLICT
      try {
        const { data: insertResult, error: insertError } = await supabase
          .from('organizations')
          .insert(organizationData)
          .select('id, name, admin_email')
          .single();
          
        if (insertError) {
          console.error("Erro detalhado ao criar organização:", insertError);
          errorHandlers.handleDatabaseConfigError();
          return;
        }
        
        if (!insertResult) {
          console.error("Falha ao criar organização: nenhum dado retornado");
          errorHandlers.handleDatabaseConfigError();
          return;
        }
        
        // Enviar email de onboarding
        try {
          console.log("Iniciando envio de e-mail de onboarding para:", insertResult.admin_email);
          
          const confirmationToken = `${window.location.origin}/setup/${insertResult.id}`;
          
          const response = await supabase.functions.invoke('send-organization-emails', {
            body: {
              organizationId: insertResult.id,
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
        
      } catch (dbError) {
        console.error("Erro inesperado durante a inserção no banco de dados:", dbError);
        errorHandlers.handleDatabaseConfigError();
        return;
      }

    } catch (error: any) {
      console.error("Erro inesperado durante a criação:", error);
      errorHandlers.handleUnexpectedError(error);
    }
  };

  return {
    handleSubmit
  };
};
