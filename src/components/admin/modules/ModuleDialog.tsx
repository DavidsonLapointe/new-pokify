
import React from "react";
import { Plan } from "@/components/admin/plans/plan-form-schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ModuleStatusSection } from "./dialog/ModuleStatusSection";
import { ModuleBasicInfoSection } from "./dialog/ModuleBasicInfoSection";
import { ModuleAreaSelector } from "./dialog/ModuleAreaSelector";
import { ModuleDescriptionSection } from "./dialog/ModuleDescriptionSection";
import { FormActions } from "./dialog/FormActions";
import { useModuleForm } from "./hooks/useModuleForm";

interface ModuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  module?: Plan;
  onSave: (data: Partial<Plan>) => void;
}

export const ModuleDialog: React.FC<ModuleDialogProps> = ({
  open,
  onOpenChange,
  module,
  onSave
}) => {
  const { 
    form, 
    isEditing, 
    onSubmit, 
    handleAddArea, 
    handleRemoveArea 
  } = useModuleForm(module, onSave);

  const handleFormSubmit = async (values: any) => {
    const success = await onSubmit(values);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto py-4">
        <DialogHeader className="py-1">
          <DialogTitle>{isEditing ? "Editar Módulo" : "Novo Módulo"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Atualize as informações do módulo conforme necessário."
              : "Preencha as informações do novo módulo."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Status Section */}
            <ModuleStatusSection form={form} />
            
            <Separator className="my-2" />
            
            {/* Basic Info Section */}
            <ModuleBasicInfoSection form={form} />
            
            {/* Area Selector */}
            <ModuleAreaSelector 
              form={form}
              handleAddArea={handleAddArea}
              handleRemoveArea={handleRemoveArea}
            />

            <Separator className="my-2" />
            
            {/* Description Section */}
            <ModuleDescriptionSection form={form} />
            
            {/* Form Actions */}
            <FormActions 
              isEditing={isEditing}
              onCancel={() => onOpenChange(false)}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
