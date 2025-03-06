
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { planFormSchema, type PlanFormValues, type Plan } from "./plan-form-schema";
import { useToast } from "@/hooks/use-toast";
import { updateStripeProduct } from "@/services/stripeService";
import { createPlan, updatePlan } from "@/services/planService";

interface UsePlanFormProps {
  plan?: Plan;
  onSave: (data: Partial<Plan>) => void;
  onOpenChange: (open: boolean) => void;
}

export function usePlanForm({ plan, onSave, onOpenChange }: UsePlanFormProps) {
  const { toast } = useToast();
  const isEditing = !!plan;

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      name: "",
      price: "",
      description: "",
      features: "",
      active: true,
      stripeProductId: "",
      stripePriceId: "",
      credits: undefined,
    },
  });

  useEffect(() => {
    if (plan) {
      // Prepare features for form
      let featuresString = "";
      if (Array.isArray(plan.features)) {
        featuresString = plan.features.join("\n");
      } else if (typeof plan.features === 'string') {
        featuresString = plan.features;
      } else if (plan.features) {
        // Fallback for any other case
        featuresString = String(plan.features);
      }

      form.reset({
        name: plan.name,
        price: plan.price.toString(),
        description: plan.description,
        features: featuresString,
        active: plan.active,
        stripeProductId: plan.stripeProductId,
        stripePriceId: plan.stripePriceId,
        credits: plan.credits,
      });
    } else {
      form.reset({
        name: "",
        price: "",
        description: "",
        features: "",
        active: true,
        stripeProductId: "",
        stripePriceId: "",
        credits: undefined,
      });
    }
  }, [plan, form]);

  const onSubmit = async (values: PlanFormValues) => {
    try {
      const formattedValues = {
        ...values,
        price: parseFloat(values.price),
        features: values.features.split("\n").filter(f => f.trim()),
        active: values.active, // Make sure active is explicitly included
      };
      
      let savedPlan: Plan | null = null;
      
      // Se estiver editando e tiver ID do Stripe, atualiza no Stripe primeiro
      if (isEditing && formattedValues.stripeProductId) {
        await updateStripeProduct({
          stripeProductId: formattedValues.stripeProductId,
          stripePriceId: formattedValues.stripePriceId || '',
          name: formattedValues.name,
          description: formattedValues.description,
          price: formattedValues.price,
          active: formattedValues.active,
          credits: formattedValues.credits,
        });
      }
      
      // Salvar no banco de dados
      if (isEditing && plan) {
        console.log('Atualizando plano', plan.id, formattedValues);
        savedPlan = await updatePlan(plan.id, formattedValues);
      } else {
        // Ensure active is explicitly included for new plans
        const newPlanData: Omit<Plan, "id"> = {
          name: formattedValues.name,
          price: formattedValues.price,
          description: formattedValues.description,
          features: formattedValues.features,
          active: formattedValues.active,
          stripeProductId: formattedValues.stripeProductId,
          stripePriceId: formattedValues.stripePriceId,
          credits: formattedValues.credits,
        };
        
        savedPlan = await createPlan(newPlanData);
      }
      
      if (savedPlan) {
        await onSave(savedPlan);
        
        toast({
          title: `Plano ${isEditing ? "atualizado" : "criado"} com sucesso!`,
          description: `O plano ${values.name} foi ${isEditing ? "atualizado" : "criado"} com sucesso.`,
        });
        
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Erro ao salvar plano:', error);
      toast({
        title: "Erro ao salvar plano",
        description: error.message || "Ocorreu um erro ao salvar o plano. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return {
    form,
    isEditing,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
