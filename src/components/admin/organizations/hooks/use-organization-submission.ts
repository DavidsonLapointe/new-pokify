
import { useFormErrorHandlers } from "../utils/form-error-handlers";
import { useUser } from "@/contexts/UserContext";
import { type CreateOrganizationFormData } from "../schema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { type OrganizationStatus, type OrganizationPendingReason } from "@/types/organization-types";

// Function to ensure status is one of the allowed values
const correctedStatus = (status: string): OrganizationStatus => {
  if (status === "active" || status === "pending" || status === "inactive") {
    return status as OrganizationStatus;
  }
  return "pending";
};

// Function to ensure pending_reason is one of the allowed values
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
  const { handlePermissionError, handleCnpjExistsError, handleOrganizationCreationError, showSuccessToast } = useFormErrorHandlers();

  const handleSubmit = async (values: CreateOrganizationFormData) => {
    try {
      console.log("Processando submissão de organização:", values);
      
      // Check user permissions
      if (!user || user.role !== "leadly_employee") {
        console.error("Permission denied: user is not a Leadly employee");
        handlePermissionError();
        return;
      }

      // Check if organization with this CNPJ already exists
      console.log("Checking existing CNPJ:", values.cnpj);
      const { data: existingOrg, error: checkError } = await supabase
        .from('organizations')
        .select('id, cnpj')
        .eq('cnpj', values.cnpj)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking existing CNPJ:", checkError);
        handleOrganizationCreationError(checkError);
        return;
      }

      if (existingOrg) {
        console.log("CNPJ already exists:", existingOrg);
        handleCnpjExistsError();
        return;
      }

      // Create object with required fields
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

      console.log("Inserting organization with data:", orgData);
      
      // Simplified insertion
      const { error: insertError } = await supabase
        .from('organizations')
        .insert([orgData]);

      if (insertError) {
        console.error("Error inserting organization:", insertError);
        handleOrganizationCreationError(insertError);
        return;
      }

      console.log("Organization created successfully!");
      showSuccessToast();
      onSuccess();

    } catch (error: any) {
      console.error("Unexpected error creating organization:", error);
      handleOrganizationCreationError(error);
    }
  };

  return { handleSubmit };
};
