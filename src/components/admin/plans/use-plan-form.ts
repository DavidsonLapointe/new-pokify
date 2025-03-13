
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

  console.log("usePlanForm iniciado com módulo:", plan);

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      name: "",
      price: "",
      shortDescription: "",
      description: "",
      benefits: "",
      howItWorks: "",
      active: true,
      comingSoon: false,
      actionButtonText: "Contratar",
      stripeProductId: "",
      stripePriceId: "",
    },
  });

  useEffect(() => {
    if (plan) {
      console.log("Carregando dados do módulo no formulário:", plan);
      
      // Prepare benefits for form
      let benefitsString = "";
      if (Array.isArray(plan.benefits)) {
        benefitsString = plan.benefits.join("\n");
      } else if (typeof plan.benefits === 'string') {
        benefitsString = plan.benefits;
      }
      
      // Prepare howItWorks for form
      let howItWorksString = "";
      if (Array.isArray(plan.howItWorks)) {
        howItWorksString = plan.howItWorks.join("\n");
      } else if (typeof plan.howItWorks === 'string') {
        howItWorksString = plan.howItWorks;
      }

      form.reset({
        name: plan.name,
        price: plan.price.toString(),
        shortDescription: plan.shortDescription || "",
        description: plan.description,
        benefits: benefitsString,
        howItWorks: howItWorksString,
        active: plan.active,
        comingSoon: plan.comingSoon || false,
        actionButtonText: plan.actionButtonText || "Contratar",
        stripeProductId: plan.stripeProductId || "",
        stripePriceId: plan.stripePriceId || "",
      });
    } else {
      form.reset({
        name: "",
        price: "",
        shortDescription: "",
        description: "",
        benefits: "",
        howItWorks: "",
        active: true,
        comingSoon: false,
        actionButtonText: "Contratar",
        stripeProductId: "",
        stripePriceId: "",
      });
    }
  }, [plan, form]);

  const onSubmit = async (values: PlanFormValues) => {
    try {
      console.log("Dados do formulário para salvar:", values);
      
      // Ensure price is a number and parse string lists to arrays
      const formattedValues = {
        ...values,
        price: parseFloat(values.price),
        benefits: values.benefits.split("\n").filter(f => f.trim()),
        howItWorks: values.howItWorks.split("\n").filter(f => f.trim()),
        active: values.active,
        comingSoon: values.comingSoon
      };
      
      console.log("Valores formatados para salvar:", formattedValues);
      
      let savedPlan: Plan | null = null;
      let stripeResult;
      
      // Se estiver editando e tiver ID do Stripe, atualiza no Stripe primeiro
      if (isEditing && formattedValues.stripeProductId) {
        try {
          console.log("Atualizando produto no Stripe");
          stripeResult = await updateStripeProduct({
            stripeProductId: formattedValues.stripeProductId,
            stripePriceId: formattedValues.stripePriceId || '',
            name: formattedValues.name,
            description: formattedValues.description,
            price: formattedValues.price,
            active: formattedValues.active,
          });
          
          console.log("Produto atualizado no Stripe com sucesso:", stripeResult);
          
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
            description: "O módulo será atualizado apenas no banco de dados local.",
            variant: "destructive",
          });
        }
      }
      
      // Salvar no banco de dados
      if (isEditing && plan) {
        console.log('Atualizando módulo', plan.id, formattedValues);
        savedPlan = await updatePlan(plan.id, formattedValues);
        console.log('Módulo atualizado:', savedPlan);
      } else {
        // Ensure active is explicitly included for new plans
        const newPlanData: Omit<Plan, "id"> = {
          name: formattedValues.name,
          price: formattedValues.price,
          shortDescription: formattedValues.shortDescription,
          description: formattedValues.description,
          benefits: formattedValues.benefits,
          howItWorks: formattedValues.howItWorks,
          active: formattedValues.active,
          comingSoon: formattedValues.comingSoon,
          actionButtonText: formattedValues.actionButtonText,
          stripeProductId: formattedValues.stripeProductId,
          stripePriceId: formattedValues.stripePriceId,
        };
        
        console.log('Criando novo módulo:', newPlanData);
        savedPlan = await createPlan(newPlanData);
        console.log('Novo módulo criado:', savedPlan);
      }
      
      if (savedPlan) {
        console.log('Módulo salvo com sucesso:', savedPlan);
        await onSave(savedPlan);
        
        toast({
          title: `Módulo ${isEditing ? "atualizado" : "criado"} com sucesso!`,
          description: `O módulo ${values.name} foi ${isEditing ? "atualizado" : "criado"} com sucesso.`,
        });
        
        onOpenChange(false);
      } else {
        console.error('Não foi possível salvar o módulo, resposta vazia');
        throw new Error('Não foi possível salvar o módulo');
      }
    } catch (error) {
      console.error('Erro ao salvar módulo:', error);
      toast({
        title: "Erro ao salvar módulo",
        description: error.message || "Ocorreu um erro ao salvar o módulo. Tente novamente.",
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
