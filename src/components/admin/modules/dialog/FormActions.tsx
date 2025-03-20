
import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isEditing: boolean;
  onCancel: () => void;
}

export const FormActions: React.FC<FormActionsProps> = ({ 
  isEditing,
  onCancel
}) => {
  return (
    <div className="flex justify-end gap-4 pt-2">
      <Button type="button" variant="cancel" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit" className="bg-primary">
        {isEditing ? "Salvar Alterações" : "Criar Módulo"}
      </Button>
    </div>
  );
};
