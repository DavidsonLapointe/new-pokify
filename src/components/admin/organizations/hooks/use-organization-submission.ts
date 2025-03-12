
import { supabase } from "@/integrations/supabase/client";
import { type CreateOrganizationFormData } from "../schema";
import { toast } from "sonner";

export const useOrganizationSubmission = (onSuccess: () => void) => {
  const checkExistingOrganization = async (cnpj: string): Promise<boolean> => {
    try {
      // Clean CNPJ to ensure consistent format
      const cleanedCnpj = cnpj.replace(/[^\d]/g, '');
      
      console.log("Checking CNPJ during submission:", cleanedCnpj);
      
      const { data, error } = await supabase
        .from('organizations')
        .select('id')
        .eq('cnpj', cleanedCnpj)
        .maybeSingle();
      
      if (error) {
        console.error("❌ Error checking CNPJ:", error);
        throw error;
      }
      
      return !!data; // Returns true if organization with this CNPJ exists
    } catch (error) {
      console.error("❌ Error checking CNPJ:", error);
      throw error;
    }
  };

  const handleSubmit = async (values: CreateOrganizationFormData) => {
    try {
      // Clean CNPJ to ensure consistent format
      const cleanedCnpj = values.cnpj.replace(/[^\d]/g, '');
      
      // Check if organization already exists
      const exists = await checkExistingOrganization(cleanedCnpj);
      
      if (exists) {
        toast.error("Uma organização com este CNPJ já existe no sistema.");
        return;
      }

      // Minimum required data for creating an organization
      const orgData = {
        name: values.razaoSocial,
        cnpj: cleanedCnpj,
        admin_email: values.adminEmail,
        admin_name: values.adminName,
        plan: values.plan,
        status: "pending" as const,
        nome_fantasia: values.nomeFantasia,
        phone: values.phone,
        admin_phone: values.adminPhone
      };

      console.log("📝 Attempting to create organization with data:", JSON.stringify(orgData, null, 2));

      const { error } = await supabase
        .from('organizations')
        .insert(orgData);

      if (error) {
        console.error("❌ Error inserting organization:", error);
        
        // Check if error is due to duplicate CNPJ
        if (error.code === '23505') {
          toast.error("Uma organização com este CNPJ já existe no sistema.");
        } else {
          toast.error("Erro ao criar organização: " + error.message);
        }
        
        throw error;
      }

      console.log("✅ Organization created successfully!");
      toast.success("Organização criada com sucesso!");
      onSuccess();

    } catch (error) {
      console.error("❌ Error creating organization:", error);
      toast.error("Falha ao criar organização. Por favor, tente novamente.");
      throw error;
    }
  };

  return { handleSubmit };
};
