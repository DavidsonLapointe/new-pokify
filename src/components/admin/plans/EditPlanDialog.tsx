
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PlanForm } from "./plan-form";
import { usePlanForm } from "./use-plan-form";
import { type Plan } from "./plan-form-schema";

interface EditPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: Plan;
  onSave: (data: Partial<Plan>) => void;
}

export const EditPlanDialog = ({ 
  open, 
  onOpenChange, 
  plan, 
  onSave 
}: EditPlanDialogProps) => {
  const { form, isEditing, onSubmit } = usePlanForm({
    plan,
    onSave,
    onOpenChange,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Plano" : "Novo Plano"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Atualize as informações do plano conforme necessário."
              : "Preencha as informações do novo plano."
            }
          </DialogDescription>
        </DialogHeader>

        <PlanForm
          form={form}
          isEditing={isEditing}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
