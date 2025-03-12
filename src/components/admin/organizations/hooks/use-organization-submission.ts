
import { supabase } from "@/integrations/supabase/client";
import { type CreateOrganizationFormData } from "../schema";
import { type OrganizationStatus } from "@/types/organization-types";
import { toast } from "sonner";

export const useOrganizationSubmission = (onSuccess: () => void) => {
  const handleSubmit = async (values: CreateOrganizationFormData) => {
    try {
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

      // Simplified insert without any conflict handling
      const { data, error } = await supabase
        .from('organizations')
        .insert(orgData)
        .select('id, name');

      if (error) {
        console.error("❌ Erro ao inserir organização:", error);
        toast.error("Erro ao criar organização: " + error.message);
        throw error;
      }

      console.log("✅ Organização criada com sucesso! ID:", data?.[0]?.id);
      toast.success("Organização criada com sucesso!");
      onSuccess();

    } catch (error) {
      console.error("❌ Erro ao criar organização:", error);
      throw error;
    }
  };

  return { handleSubmit };
};
