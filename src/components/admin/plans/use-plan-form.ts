
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { planFormSchema, type PlanFormValues, type Plan } from "./plan-form-schema";
import { useToast } from "@/hooks/use-toast";
import { updateStripeProduct } from "@/services/stripeService";
import { createPlan, updatePlan } from "@/services/plans";

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
      shortDescription: "",
      benefits: "",
      active: true,
      credits: null,
      stripeProductId: "",
      stripePriceId: "",
    },
  });

  useEffect(() => {
    if (plan) {
      // Prepare benefits for form
      let benefitsString = "";
      if (Array.isArray(plan.benefits)) {
        benefitsString = plan.benefits.join("\n");
      } else if (typeof plan.benefits === 'string') {
        benefitsString = plan.benefits;
      }
      
      form.reset({
        name: plan.name,
        price: plan.price.toString(),
        shortDescription: plan.shortDescription || "",
        benefits: benefitsString,
        active: plan.active,
        credits: plan.credits || null,
        stripeProductId: plan.stripeProductId || "",
        stripePriceId: plan.stripePriceId || "",
      });
    } else {
      form.reset({
        name: "",
        price: "",
        shortDescription: "",
        benefits: "",
        active: true,
        credits: null,
        stripeProductId: "",
        stripePriceId: "",
      });
    }
  }, [plan, form]);

  const onSubmit = async (values: PlanFormValues) => {
    try {
      // Ensure price is a number and parse string lists to arrays
      const formattedValues = {
        ...values,
        price: parseFloat(values.price),
        benefits: values.benefits.split("\n").filter(f => f.trim()),
        active: values.active,
      };
      
      let savedPlan: Plan | null = null;
      let stripeResult;
      
      // Se estiver editando e tiver ID do Stripe, atualiza no Stripe primeiro
      if (isEditing && formattedValues.stripeProductId) {
        try {
          stripeResult = await updateStripeProduct({
            stripeProductId: formattedValues.stripeProductId,
            stripePriceId: formattedValues.stripePriceId || '',
            name: formattedValues.name,
            description: formattedValues.shortDescription,
            price: formattedValues.price,
            active: formattedValues.active,
            credits: formattedValues.credits
          });
          
          // Atualizar o stripePriceId com o novo preço se ele foi atualizado
          if (stripeResult.priceUpdated && stripeResult.price?.id !== formattedValues.stripePriceId) {
            formattedValues.stripePriceId = stripeResult.price.id;
            
            toast({
              title: "Preço atualizado no Stripe",
              description: "Um novo preço foi criado no Stripe e o anterior foi arquivado.",
              variant: "default",
            });
          }
        } catch (stripeError) {
          console.error("Erro ao atualizar no Stripe:", stripeError);
          toast({
            title: "Erro ao atualizar no Stripe",
            description: "O plano será atualizado apenas no banco de dados local.",
            variant: "destructive",
          });
        }
      }
      
      // Salvar no banco de dados
      if (isEditing && plan) {
        savedPlan = await updatePlan(plan.id, formattedValues);
      } else {
        // Ensure active is explicitly included for new plans
        const newPlanData: Omit<Plan, "id"> = {
          name: formattedValues.name,
          price: formattedValues.price,
          shortDescription: formattedValues.shortDescription,
          benefits: formattedValues.benefits,
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
      } else {
        throw new Error('Não foi possível salvar o plano');
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
