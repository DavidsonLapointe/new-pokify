
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrganizationSchema, type CreateOrganizationFormData } from "../schema";
import { usePlans } from "./use-plans";

export const useOrganizationFormInit = () => {
  const { plans } = usePlans();
  
  const form = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      razaoSocial: "",
      nomeFantasia: "",
      cnpj: "",
      phone: "",
      plan: "",
      adminName: "",
      adminEmail: "",
      adminPhone: "",
      status: "pending",
    },
  });

  // Set default plan when plans are loaded
  useEffect(() => {
    if (plans.length > 0 && !form.getValues("plan")) {
      // Set the first active plan as default
      console.log("Definindo plano padrão:", plans[0].id);
      form.setValue("plan", String(plans[0].id));
    }
  }, [plans, form]);

  return {
    form
  };
};
