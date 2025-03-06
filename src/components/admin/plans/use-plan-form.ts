
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

  console.log("usePlanForm iniciado com plano:", plan);

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
      console.log("Carregando dados do plano no formulário:", plan);
      
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
        stripeProductId: plan.stripeProductId || "",
        stripePriceId: plan.stripePriceId || "",
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
      console.log("Dados do formulário para salvar:", values);
      
      // Ensure price is a number and features is an array
      const formattedValues = {
        ...values,
        price: parseFloat(values.price),
        features: values.features.split("\n").filter(f => f.trim()),
        active: values.active, 
        // Ensure credits is a number if provided
        credits: typeof values.credits === 'string' 
          ? parseInt(values.credits, 10) 
          : (values.credits === undefined ? undefined : Number(values.credits))
      };
      
      console.log("Valores formatados para salvar:", formattedValues);
      
      let savedPlan: Plan | null = null;
      
      // Se estiver editando e tiver ID do Stripe, atualiza no Stripe primeiro
      if (isEditing && formattedValues.stripeProductId) {
        try {
          console.log("Atualizando produto no Stripe");
          await updateStripeProduct({
            stripeProductId: formattedValues.stripeProductId,
            stripePriceId: formattedValues.stripePriceId || '',
            name: formattedValues.name,
            description: formattedValues.description,
            price: formattedValues.price,
            active: formattedValues.active,
            credits: formattedValues.credits,
          });
          console.log("Produto atualizado no Stripe com sucesso");
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
        console.log('Atualizando plano', plan.id, formattedValues);
        savedPlan = await updatePlan(plan.id, formattedValues);
        console.log('Plano atualizado:', savedPlan);
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
        
        console.log('Criando novo plano:', newPlanData);
        savedPlan = await createPlan(newPlanData);
        console.log('Novo plano criado:', savedPlan);
      }
      
      if (savedPlan) {
        console.log('Plano salvo com sucesso:', savedPlan);
        await onSave(savedPlan);
        
        toast({
          title: `Plano ${isEditing ? "atualizado" : "criado"} com sucesso!`,
          description: `O plano ${values.name} foi ${isEditing ? "atualizado" : "criado"} com sucesso.`,
        });
        
        onOpenChange(false);
      } else {
        console.error('Não foi possível salvar o plano, resposta vazia');
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
