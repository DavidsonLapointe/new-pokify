
import { useFormErrorHandlers } from "../utils/form-error-handlers";
import { useUser } from "@/contexts/UserContext";
import { type CreateOrganizationFormData } from "../schema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { type OrganizationStatus, type OrganizationPendingReason } from "@/types/organization-types";

const correctedStatus = (status: string): OrganizationStatus => {
  return ["active", "pending", "inactive"].includes(status) 
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

      // Dados básicos da organização com tipagem correta
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
        status: correctedStatus("pending"),
        contract_status: "pending",
        payment_status: "pending",
        registration_status: "pending",
        pending_reason: correctedPendingReason("user_validation")
      };

      console.log("Tentando inserir organização com dados:", organizationData);
      
      // Inserção com tipos corrigidos
      const { error: insertError } = await supabase
        .from('organizations')
        .insert(organizationData);

      if (insertError) {
        console.error("Erro ao inserir organização:", insertError);
        errorHandlers.handleDatabaseConfigError();
        return;
      }

      // Buscar a organização recém-criada
      const { data: newOrg, error: fetchError } = await supabase
        .from('organizations')
        .select('id, name, admin_email')
        .eq('cnpj', values.cnpj)
        .maybeSingle();

      if (fetchError || !newOrg) {
        console.error("Erro ao buscar organização após criação:", fetchError);
        errorHandlers.handleDatabaseConfigError();
        return;
      }

      // Enviar email de onboarding
      try {
        console.log("Enviando email de onboarding para:", newOrg.admin_email);
        const confirmationToken = `${window.location.origin}/setup/${newOrg.id}`;
        
        const response = await supabase.functions.invoke('send-organization-emails', {
          body: {
            organizationId: newOrg.id,
            type: "onboarding",
            data: { confirmationToken }
          }
        });
        
        if (response.error) {
          console.error("Erro no envio do email:", response.error);
          errorHandlers.handleEmailError(response.error);
        }
      } catch (emailError) {
        console.error("Erro no processo de email:", emailError);
        errorHandlers.handleEmailError(emailError);
      }

      errorHandlers.showSuccessToast();
      onSuccess();

    } catch (error: any) {
      console.error("Erro inesperado:", error);
      errorHandlers.handleUnexpectedError(error);
    }
  };

  return { handleSubmit };
};
