
import { useFormErrorHandlers } from "../utils/form-error-handlers";
import { useUser } from "@/contexts/UserContext";
import { type CreateOrganizationFormData } from "../schema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { type OrganizationStatus, type OrganizationPendingReason } from "@/types/organization-types";

// Função para garantir que o status seja um dos valores permitidos
const correctedStatus = (status: string): OrganizationStatus => {
  if (status === "active" || status === "pending" || status === "inactive") {
    return status as OrganizationStatus;
  }
  return "pending";
};

// Função para garantir que pending_reason seja um dos valores permitidos
const correctedPendingReason = (reason: string | null): OrganizationPendingReason => {
  if (reason === "contract_signature" || 
      reason === "mensalidade_payment" || 
      reason === "user_validation" || 
      reason === null) {
    return reason as OrganizationPendingReason;
  }
  return "user_validation";
};

export const useOrganizationSubmission = (onSuccess: () => void) => {
  const { user } = useUser();
  const errorHandlers = useFormErrorHandlers();

  const handleSubmit = async (values: CreateOrganizationFormData) => {
    try {
      console.log("TESTE: Processando apenas inserção básica:", values);
      
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

      // Criando objeto com apenas campos mínimos essenciais
      const minimalOrgData = {
        name: values.razaoSocial,
        cnpj: values.cnpj,
        admin_name: values.adminName,
        admin_email: values.adminEmail,
        status: correctedStatus("pending")
      };

      console.log("TESTE: Tentando inserção com dados mínimos:", minimalOrgData);
      
      // Inserção simples, sem select ou retorno de dados
      const { error: insertError } = await supabase
        .from('organizations')
        .insert(minimalOrgData);

      if (insertError) {
        console.error("TESTE: Erro na inserção básica:", insertError);
        errorHandlers.handleDatabaseConfigError();
        return;
      }

      console.log("TESTE: Inserção básica bem-sucedida!");
      errorHandlers.showSuccessToast();
      onSuccess();

    } catch (error: any) {
      console.error("Erro inesperado:", error);
      errorHandlers.handleUnexpectedError(error);
    }
  };

  return { handleSubmit };
};
