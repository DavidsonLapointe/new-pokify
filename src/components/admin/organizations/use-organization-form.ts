
import { useOrganizationFormInit } from "./hooks/use-organization-form-init";
import { useOrganizationSubmission } from "./hooks/use-organization-submission";
import { checkCnpjExists } from "./utils/cnpj-verification-utils";
import { CreateOrganizationFormData } from "./schema";
import { toast } from "sonner";

/**
 * Main hook that combines all organization form functionality
 */
export const useOrganizationForm = (onSuccess: () => void) => {
  const { form } = useOrganizationFormInit();
  const { handleSubmit } = useOrganizationSubmission(onSuccess);

  const onSubmit = async (values: CreateOrganizationFormData) => {
    // Reset form after submission is handled
    try {
      // Log the modules being submitted
      console.log("Creating organization with modules:", values.modules);
      
      await handleSubmit(values);
      form.reset();
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("Erro ao criar empresa. Tente novamente.");
    }
  };

  return {
    form,
    onSubmit,
    checkCnpjExists
  };
};
