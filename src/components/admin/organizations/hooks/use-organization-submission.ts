
import { useFormErrorHandlers } from "../utils/form-error-handlers";
import { useUser } from "@/contexts/UserContext";
import { type CreateOrganizationFormData } from "../schema";
import { supabase } from "@/integrations/supabase/client";
import { type OrganizationStatus, type OrganizationPendingReason } from "@/types/organization-types";
import { toast } from "sonner";

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
        status: "pending" as OrganizationStatus,
        nome_fantasia: values.nomeFantasia,
        phone: values.phone,
        admin_phone: values.adminPhone,
        contract_status: 'completed', // Contract step is now skipped
        payment_status: 'pending',
        registration_status: 'pending',
        pending_reason: 'user_validation' as OrganizationPendingReason
      };

      console.log("Inserting organization with data:", orgData);
      
      // Insert the organization
      const { data: insertedOrg, error: insertError } = await supabase
        .from('organizations')
        .insert(orgData)
        .select('id')
        .single();

      if (insertError) {
        console.error("Error inserting organization:", insertError);
        handleOrganizationCreationError(insertError);
        return;
      }

      if (!insertedOrg || !insertedOrg.id) {
        console.error("Organization created but no ID returned");
        toast.error("Erro ao criar empresa: Resposta incompleta do servidor");
        return;
      }

      console.log("Organization created successfully with ID:", insertedOrg.id);

      // Send email to admin
      try {
        const emailResponse = await supabase.functions.invoke('send-organization-emails', {
          body: {
            organizationId: insertedOrg.id,
            type: "onboarding",
            data: {
              confirmationToken: `${window.location.origin}/confirmacao/${insertedOrg.id}`
            }
          }
        });
        
        console.log("Email function response:", emailResponse);
        
        if (emailResponse.error) {
          console.warn("Email sending warning:", emailResponse.error);
          // We don't fail the organization creation if email fails
        }
      } catch (emailError) {
        console.error("Failed to invoke email function:", emailError);
        // Continue with success, we don't want email failures to block organization creation
      }

      console.log("Organization creation process completed successfully");
      showSuccessToast();
      onSuccess();

    } catch (error: any) {
      console.error("Unexpected error creating organization:", error);
      handleOrganizationCreationError(error);
    }
  };

  return { handleSubmit };
};
