
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@/contexts/UserContext";
import { createOrganizationSchema, type CreateOrganizationFormData } from "./schema";
import { calculateProRataValue, getPlanValues } from "./utils/calculation-utils";
import { 
  checkExistingOrganization, 
  createOrganization, 
  handleProRataCreation, 
  sendOnboardingEmail 
} from "./api/organization-api";
import { useFormErrorHandlers } from "./utils/form-error-handlers";

export const useOrganizationForm = (onSuccess: () => void) => {
  const { user } = useUser();
  const errorHandlers = useFormErrorHandlers();
  
  const form = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      razaoSocial: "",
      nomeFantasia: "",
      cnpj: "",
      email: "",
      phone: "",
      plan: "professional",
      adminName: "",
      adminEmail: "",
      status: "pending",
    },
  });

  const onSubmit = async (values: CreateOrganizationFormData) => {
    try {
      // Verify user permission
      if (user.role !== "leadly_employee") {
        errorHandlers.handlePermissionError();
        return;
      }

      console.log("Iniciando criação da organização:", values);

      // Check if CNPJ exists
      const { data: existingOrg, error: checkError } = await checkExistingOrganization(values.cnpj);

      if (checkError) {
        console.error("Erro ao verificar CNPJ existente:", checkError);
      }

      if (existingOrg) {
        errorHandlers.handleCnpjExistsError();
        return;
      }

      // Create organization
      const { data: newOrganizationData, error: orgError } = await createOrganization(values);

      if (orgError) {
        errorHandlers.handleOrganizationCreationError(orgError);
        return;
      }

      console.log("Organização criada com sucesso:", newOrganizationData);

      // Calculate pro-rata value
      const planValues = getPlanValues();
      let proRataValue = calculateProRataValue(planValues[values.plan as keyof typeof planValues]);
      
      console.log("Valor pro-rata calculado:", proRataValue);

      try {
        // Create pro-rata title
        const proRataTitle = await handleProRataCreation(newOrganizationData);

        console.log("Título pro-rata criado:", proRataTitle);

        if (!proRataTitle) {
          console.error("Falha ao criar título pro-rata");
        }
        
        // Send single onboarding email with all links
        try {
          console.log("Enviando email único de onboarding...");
          const { error: emailError } = await sendOnboardingEmail(
            newOrganizationData.id,
            `${window.location.origin}/contract/${newOrganizationData.id}`,
            `${window.location.origin}/confirm-registration/${newOrganizationData.id}`,
            `${window.location.origin}/payment/${newOrganizationData.id}`,
            proRataValue
          );

          if (emailError) {
            console.error("Erro ao enviar email de onboarding:", emailError);
            throw emailError;
          }

          console.log("Email de onboarding enviado com sucesso");
        } catch (emailError) {
          errorHandlers.handleEmailError(emailError);
          // Continue with success flow even if email fails
        }

        errorHandlers.showSuccessToast();
        form.reset();
        onSuccess();
      } catch (error) {
        errorHandlers.handlePostCreationError(error);
        form.reset();
        onSuccess();
      }
    } catch (error: any) {
      errorHandlers.handleUnexpectedError(error);
    }
  };

  return {
    form,
    onSubmit,
  };
};
