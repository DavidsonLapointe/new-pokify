
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plan } from "@/components/admin/plans/plan-form-schema";
import { moduleFormSchema, ModuleFormValues } from "../module-form-schema";
import { toast } from "sonner";

export const useModuleForm = (
  module?: Plan,
  onSave?: (data: Partial<Plan>) => void
) => {
  const isEditing = !!module;
  
  // Initialize the form with react-hook-form
  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleFormSchema),
    defaultValues: {
      name: module?.name || "",
      price: module?.price ? module.price.toString() : "",
      shortDescription: module?.shortDescription || "",
      description: module?.description || "",
      benefits: Array.isArray(module?.benefits) ? module.benefits.join("\n") : "",
      howItWorks: Array.isArray(module?.howItWorks) ? module.howItWorks.join("\n") : "",
      active: module?.active !== undefined ? module.active : true,
      comingSoon: module?.comingSoon || false,
      icon: module?.icon || "MessageCircle",
      actionButtonText: module?.actionButtonText || "Contratar",
      credits: module?.credits || null,
      areas: module?.areas || [],
    }
  });

  // Update form when module changes
  useEffect(() => {
    if (module) {
      form.reset({
        name: module.name,
        price: module.price.toString(),
        shortDescription: module.shortDescription || "",
        description: module.description || "",
        benefits: Array.isArray(module.benefits) ? module.benefits.join("\n") : "",
        howItWorks: Array.isArray(module.howItWorks) ? module.howItWorks.join("\n") : "",
        active: module.active,
        comingSoon: module.comingSoon || false,
        icon: module.icon || "MessageCircle",
        actionButtonText: module.actionButtonText || "Contratar",
        credits: module.credits || null,
        areas: module.areas || [],
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
        icon: "MessageCircle",
        actionButtonText: "Contratar",
        credits: null,
        areas: [],
      });
    }
  }, [module, form]);

  // Function to process form submission
  const onSubmit = async (values: ModuleFormValues) => {
    try {
      // Convert form values to the expected format
      const formattedValues: Partial<Plan> = {
        ...values,
        price: parseFloat(values.price),
        benefits: values.benefits.split("\n").filter(b => b.trim()),
        howItWorks: values.howItWorks.split("\n").filter(hw => hw.trim()),
        areas: values.areas,
      };
      
      if (onSave) {
        await onSave(formattedValues);
      }
      return true;
    } catch (error) {
      console.error('Erro ao salvar módulo:', error);
      toast.error("Ocorreu um erro ao salvar o módulo.");
      return false;
    }
  };

  // Helper for adding area to the list
  const handleAddArea = (areaId: string) => {
    const currentAreas = form.getValues().areas || [];
    if (!currentAreas.includes(areaId)) {
      form.setValue('areas', [...currentAreas, areaId]);
    }
  };

  // Helper for removing area from the list
  const handleRemoveArea = (areaId: string) => {
    const currentAreas = form.getValues().areas || [];
    form.setValue('areas', currentAreas.filter(id => id !== areaId));
  };

  return {
    form,
    isEditing,
    onSubmit,
    handleAddArea,
    handleRemoveArea
  };
};
