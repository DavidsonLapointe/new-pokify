
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@/contexts/UserContext";
import { createOrganizationSchema, type CreateOrganizationFormData } from "./schema";
import { calculateProRataValue, getPlanValues } from "./utils/calculation-utils";
import { 
  checkExistingOrganization, 
  createOrganization, 
  handleProRataCreation, 
  sendOnboardingEmail,
  mapToOrganizationType
} from "./api/organization-api";
import { useFormErrorHandlers } from "./utils/form-error-handlers";
import { createInactiveSubscription } from "@/services/subscriptionService";
import { usePlans } from "./hooks/use-plans";
import { useEffect } from "react";
import { cleanCNPJ } from "@/utils/cnpjValidation";

export const useOrganizationForm = (onSuccess: () => void) => {
  const { user } = useUser();
  const errorHandlers = useFormErrorHandlers();
  const { plans } = usePlans();
  
  const form = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      razaoSocial: "",
      nomeFantasia: "",
      cnpj: "",
      email: "",
      phone: "",
      plan: "", // Empty string as default
      adminName: "",
      adminEmail: "",
      status: "pending",
    },
  });

  // Set default plan when plans are loaded
  useEffect(() => {
    if (plans.length > 0 && !form.getValues("plan")) {
      // Set the first active plan as default, ensuring it's a string
      form.setValue("plan", String(plans[0].id));
    }
  }, [plans, form]);

  // Function to check if CNPJ already exists
  const checkCnpjExists = async (cnpj: string): Promise<{exists: boolean, data?: any, error?: any}> => {
    try {
      console.log("Iniciando verificação de CNPJ:", cnpj);
      
      const { exists, data, error } = await checkExistingOrganization(cnpj);
      
      if (error) {
        console.error("Erro ao verificar CNPJ existente:", error);
        throw error;
      }
      
      console.log("Resultado da verificação:", exists ? "CNPJ já existe" : "CNPJ disponível");
      
      // Return whether CNPJ exists or not along with data
      return { exists, data };
    } catch (error) {
      console.error("Erro ao verificar CNPJ:", error);
      throw error;
    }
  };

  const onSubmit = async (values: CreateOrganizationFormData) => {
    try {
      // Verify user permission
      if (user.role !== "leadly_employee") {
        errorHandlers.handlePermissionError();
        return;
      }

      console.log("Iniciando criação da organização:", values);

      // Create organization
      const { data: newOrganizationData, error: orgError } = await createOrganization(values);

      if (orgError) {
        errorHandlers.handleOrganizationCreationError(orgError);
        return;
      }

      console.log("Organização criada com sucesso:", newOrganizationData);

      // Convert DB organization to Organization type
      const organizationFormatted = mapToOrganizationType(newOrganizationData);

      // Criar assinatura inativa para a nova organização
      const inactiveSubscription = await createInactiveSubscription(organizationFormatted.id);
      
      if (inactiveSubscription) {
        console.log("Assinatura inativa criada com sucesso:", inactiveSubscription);
      } else {
        console.error("Erro ao criar assinatura inativa");
      }

      // Calculate pro-rata value
      const planValues = getPlanValues();
      let proRataValue = calculateProRataValue(planValues[values.plan as keyof typeof planValues]);
      
      console.log("Valor pro-rata calculado:", proRataValue);

      try {
        // Create pro-rata title
        const proRataTitle = await handleProRataCreation(organizationFormatted);

        console.log("Título pro-rata criado:", proRataTitle);

        if (!proRataTitle) {
          console.error("Falha ao criar título pro-rata");
        }
        
        // Send single onboarding email with all links
        try {
          console.log("Enviando email único de onboarding...");
          const { error: emailError } = await sendOnboardingEmail(
            organizationFormatted.id,
            `${window.location.origin}/contract/${organizationFormatted.id}`,
            `${window.location.origin}/confirm-registration/${organizationFormatted.id}`,
            `${window.location.origin}/payment/${organizationFormatted.id}`,
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
    checkCnpjExists
  };
};
