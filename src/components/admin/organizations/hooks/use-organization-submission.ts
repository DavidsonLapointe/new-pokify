
import { supabase } from "@/integrations/supabase/client";
import { type CreateOrganizationFormData } from "../schema";
import { type OrganizationStatus } from "@/types/organization-types";
import { toast } from "sonner";

export const useOrganizationSubmission = (onSuccess: () => void) => {
  const checkExistingOrganization = async (cnpj: string): Promise<boolean> => {
    try {
      // Check if an organization with this CNPJ already exists
      const { data, error } = await supabase
        .from('organizations')
        .select('id')
        .eq('cnpj', cnpj)
        .maybeSingle();
      
      if (error) {
        console.error("❌ Erro ao verificar CNPJ:", error);
        throw error;
      }
      
      return !!data; // Returns true if an organization with this CNPJ exists
    } catch (error) {
      console.error("❌ Erro ao verificar CNPJ:", error);
      return false; // Assume no duplicate in case of error to allow the flow to continue
    }
  };

  const handleSubmit = async (values: CreateOrganizationFormData) => {
    try {
      // Check if an organization with this CNPJ already exists
      const exists = await checkExistingOrganization(values.cnpj);
      
      if (exists) {
        toast.error("Uma organização com este CNPJ já existe no sistema.");
        return;
      }

      // Dados mínimos necessários para criar uma organização
      const orgData = {
        name: values.razaoSocial,
        cnpj: values.cnpj,
        admin_email: values.adminEmail,
        admin_name: values.adminName,
        plan: values.plan,
        status: "pending" as OrganizationStatus,
        nome_fantasia: values.nomeFantasia,
        phone: values.phone,
        admin_phone: values.adminPhone
      };

      console.log("📝 Tentando criar organização com dados:", JSON.stringify(orgData, null, 2));

      // Simplified insert without any additional options
      const { error } = await supabase
        .from('organizations')
        .insert(orgData);

      if (error) {
        console.error("❌ Erro ao inserir organização:", error);
        toast.error("Erro ao criar organização: " + error.message);
        throw error;
      }

      console.log("✅ Organização criada com sucesso!");
      toast.success("Organização criada com sucesso!");
      onSuccess();

    } catch (error) {
      console.error("❌ Erro ao criar organização:", error);
      throw error;
    }
  };

  return { handleSubmit };
};
