
import { useOrganizationFormInit } from "./hooks/use-organization-form-init";
import { useOrganizationSubmission } from "./hooks/use-organization-submission";
import { type CreateOrganizationFormData } from "./schema";

export const useOrganizationForm = (onSuccess: () => void) => {
  const { form } = useOrganizationFormInit();
  const { handleSubmit } = useOrganizationSubmission(onSuccess);

  const onSubmit = async (values: CreateOrganizationFormData) => {
    try {
      await handleSubmit(values);
      form.reset();
    } catch (error) {
      console.error("Error in form submission:", error);
      throw error;
    }
  };

  return {
    form,
    onSubmit
  };
};
