
import { useOrganizationFormInit } from "./hooks/use-organization-form-init";
import { useOrganizationSubmission } from "./hooks/use-organization-submission";
import { checkExistingOrganization } from "./utils/cnpj-verification-utils";
import { CreateOrganizationFormData } from "./schema";

/**
 * Main hook that combines all organization form functionality
 */
export const useOrganizationForm = (onSuccess: () => void) => {
  const { form } = useOrganizationFormInit();
  const { handleSubmit } = useOrganizationSubmission(onSuccess);

  const onSubmit = async (values: CreateOrganizationFormData) => {
    console.log("Iniciando submissão do formulário com valores:", values);
    
    try {
      await handleSubmit(values);
      form.reset();
    } catch (error) {
      console.error("Error in form submission:", error);
      // Error will be handled by the UI component that called this function
      throw error; // Re-throw to allow the calling component to handle it
    }
  };

  return {
    form,
    onSubmit,
    checkExistingOrganization
  };
};
