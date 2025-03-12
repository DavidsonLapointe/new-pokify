
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
      console.log("Processando submissão de organização:", values);
      
      // Verificar permissões do usuário
      if (!user || user.role !== "leadly_employee") {
        console.error("Permissão negada: usuário não é funcionário Leadly");
        toast.error("Acesso negado: Apenas funcionários Leadly podem criar organizações");
        return;
      }

      // Verificar se já existe organização com este CNPJ
      console.log("Verificando CNPJ existente:", values.cnpj);
      const { data: existingOrg, error: checkError } = await supabase
        .from('organizations')
        .select('id, cnpj')
        .eq('cnpj', values.cnpj)
        .maybeSingle();

      if (checkError) {
        console.error("Erro ao verificar CNPJ existente:", checkError);
        toast.error("Erro de configuração no banco de dados. Por favor, contate o suporte técnico.");
        return;
      }

      if (existingOrg) {
        console.log("CNPJ já existente:", existingOrg);
        toast.error("CNPJ já cadastrado: Já existe uma empresa cadastrada com este CNPJ.");
        return;
      }

      // Criando objeto com os campos obrigatórios
      const orgData = {
        name: values.razaoSocial,
        cnpj: values.cnpj,
        admin_name: values.adminName,
        admin_email: values.adminEmail,
        plan: values.plan,
        status: correctedStatus("pending"),
        nome_fantasia: values.nomeFantasia,
        phone: values.phone,
        admin_phone: values.adminPhone,
        // Set contract_status to completed since we're skipping this step
        contract_status: 'completed',
        payment_status: 'pending',
        registration_status: 'pending'
      };

      console.log("Inserindo organização com dados:", orgData);
      
      // Inserção simplificada
      const { data, error: insertError } = await supabase
        .from('organizations')
        .insert([orgData]);

      if (insertError) {
        console.error("Erro na inserção da organização:", insertError);
        
        if (insertError.code === '23505') {
          toast.error("CNPJ já cadastrado: Já existe uma empresa cadastrada com este CNPJ.");
        } else if (insertError.message && insertError.message.includes("violates row-level security policy")) {
          toast.error("Erro de permissão: Você não tem permissão para criar organizações. Verifique suas credenciais.");
        } else {
          console.log("Detalhes do erro:", JSON.stringify(insertError));
          toast.error("Erro ao criar empresa: " + insertError.message);
        }
        return;
      }

      console.log("Organização criada com sucesso!");
      toast.success("Empresa criada com sucesso! Um email será enviado para o administrador contendo todas as instruções de onboarding.");
      onSuccess();

    } catch (error: any) {
      console.error("Erro inesperado na criação de organização:", error);
      toast.error("Erro ao criar empresa: " + (error.message || "Erro desconhecido"));
    }
  };

  return { handleSubmit };
};
