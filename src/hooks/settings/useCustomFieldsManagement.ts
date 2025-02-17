
import { useState } from "react";
import { toast } from "sonner";
import { CustomField } from "@/components/settings/types";

export const useCustomFieldsManagement = () => {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [newField, setNewField] = useState<Partial<CustomField>>({});
  const [isEditingField, setIsEditingField] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

  const handleOpenNewField = () => {
    setIsEditingField(false);
    setEditingFieldId(null);
    setNewField({});
  };

  const handleOpenEditField = (field: CustomField) => {
    setIsEditingField(true);
    setEditingFieldId(field.id);
    setNewField(field);
  };

  const handleSaveFieldsSettings = () => {
    if (!newField.name || !newField.description) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (isEditingField && editingFieldId) {
      setCustomFields(customFields.map(field => 
        field.id === editingFieldId 
          ? { ...field, ...newField } 
          : field
      ));
      toast.success("Campo personalizado atualizado com sucesso");
    } else {
      const field: CustomField = {
        id: crypto.randomUUID(),
        name: newField.name,
        description: newField.description,
        isRequired: newField.isRequired || false,
      };
      setCustomFields([...customFields, field]);
      toast.success("Campo personalizado salvo com sucesso");
    }

    setNewField({});
    setIsEditingField(false);
    setEditingFieldId(null);
  };

  return {
    customFields,
    newField,
    isEditingField,
    setNewField,
    handleOpenNewField,
    handleOpenEditField,
    handleSaveFieldsSettings,
  };
};
