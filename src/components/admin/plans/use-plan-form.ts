
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
    },
  });

  useEffect(() => {
    if (plan) {
      form.reset({
        name: plan.name,
        price: plan.price.toString(),
        description: plan.description,
        features: plan.features.join("\n"),
        active: plan.active,
      });
    } else {
      form.reset({
        name: "",
        price: "",
        description: "",
        features: "",
        active: true,
      });
    }
  }, [plan, form]);

  const onSubmit = async (values: PlanFormValues) => {
    try {
      const formattedValues = {
        ...values,
        price: parseFloat(values.price),
        features: values.features.split("\n").filter(f => f.trim()),
      };
      
      await onSave(formattedValues);
      
      toast({
        title: `Plano ${isEditing ? "atualizado" : "criado"} com sucesso!`,
        description: `O plano ${values.name} foi ${isEditing ? "atualizado" : "criado"} com sucesso.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao salvar plano",
        description: "Ocorreu um erro ao salvar o plano. Tente novamente.",
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
