
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
    // Reset form after submission is handled
    try {
      await handleSubmit(values);
      form.reset();
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  return {
    form,
    onSubmit,
    checkExistingOrganization
  };
};
