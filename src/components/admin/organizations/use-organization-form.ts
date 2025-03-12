
import { useOrganizationFormInit } from "./hooks/use-organization-form-init";
import { useOrganizationSubmission } from "./hooks/use-organization-submission";
import { checkExistingOrganization } from "./utils/cnpj-verification-utils";
import { type CreateOrganizationFormData } from "./schema";

export const useOrganizationForm = (onSuccess: () => void) => {
  const { form } = useOrganizationFormInit();
  const { handleSubmit } = useOrganizationSubmission(onSuccess);

  const onSubmit = async (values: CreateOrganizationFormData) => {
    console.log("Iniciando submissão do formulário com valores:", values);
    
    try {
      await handleSubmit(values);
      form.reset();
      // onSuccess is called by useOrganizationSubmission
    } catch (error) {
      console.error("Error in form submission:", error);
      // Do not reset the form on error, let the user correct any issues
      throw error; // Re-throw to allow the UI component to handle it
    }
  };

  return {
    form,
    onSubmit,
    checkExistingOrganization
  };
};
