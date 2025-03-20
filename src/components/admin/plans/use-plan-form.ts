
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { planFormSchema, type PlanFormValues, type Plan } from "./plan-form-schema";
import { useToast } from "@/hooks/use-toast";

interface UsePlanFormProps {
  plan?: Plan;
  onSave: (data: Partial<Plan>) => void;
  onOpenChange: (open: boolean) => void;
}

let nextId = 100; // ID inicial para novos planos mockados

export function usePlanForm({ plan, onSave, onOpenChange }: UsePlanFormProps) {
  const { toast } = useToast();
  const isEditing = !!plan;

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      name: "",
      price: "0",
      description: "",
      shortDescription: "",
      benefits: [],
      active: true,
      credits: null,
      areas: [],
    },
  });

  // Reseta o formulário quando o plano muda ou quando o componente é montado
  useEffect(() => {
    console.log("usePlanForm - plan mudou:", plan);
    
    // Se temos um plano (modo edição)
    if (plan) {
      // Prepare benefits for form
      let benefitsString = "";
      if (Array.isArray(plan.benefits)) {
        benefitsString = plan.benefits.join("\n");
      } else if (Array.isArray(plan.features)) {
        // Backward compatibility for features
        benefitsString = plan.features.join("\n");
      } else if (typeof plan.benefits === 'string') {
        benefitsString = plan.benefits;
      }
      
      // Preenche o formulário com os dados do plano
      form.reset({
        name: plan.name,
        price: plan.price.toString(),
        description: plan.description || "",
        shortDescription: plan.shortDescription || "",
        benefits: benefitsString,
        active: plan.active,
        credits: plan.credits || null,
        areas: plan.areas || [],
      });
    } else {
      // Caso contrário, reseta para os valores padrão (modo criação)
      console.log("Resetando formulário para valores padrão");
      form.reset({
        name: "",
        price: "0",
        description: "",
        shortDescription: "",
        benefits: "",
        active: true,
        credits: null,
        areas: [],
      });
    }
  }, [plan, form]);

  const onSubmit = async (values: PlanFormValues) => {
    try {
      // Ensure price is a number and parse string lists to arrays
      const formattedValues = {
        ...values,
        price: parseFloat(values.price.toString()),
        benefits: typeof values.benefits === 'string' 
          ? values.benefits.split("\n").filter(f => f.trim()) 
          : values.benefits,
        active: values.active,
      };
      
      let savedPlan: Plan | null = null;
      
      // Modo mockado: apenas criar ou atualizar o plano em memória
      if (isEditing && plan) {
        // Atualiza o plano existente
        savedPlan = {
          ...plan,
          name: formattedValues.name,
          price: formattedValues.price,
          description: formattedValues.description,
          shortDescription: formattedValues.shortDescription,
          benefits: formattedValues.benefits,
          active: formattedValues.active,
          credits: formattedValues.credits,
          areas: formattedValues.areas,
          // Mantém os outros campos do plano original
        };
      } else {
        // Cria um novo plano
        savedPlan = {
          id: nextId++,
          name: formattedValues.name,
          price: formattedValues.price,
          description: formattedValues.description,
          shortDescription: formattedValues.shortDescription,
          benefits: formattedValues.benefits,
          active: formattedValues.active,
          credits: formattedValues.credits,
          areas: formattedValues.areas,
          stripeProductId: `mock_product_${Date.now()}`,
          stripePriceId: `mock_price_${Date.now()}`
        };
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
