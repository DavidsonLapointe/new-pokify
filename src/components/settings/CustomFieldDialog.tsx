
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { CustomField } from "./types";

interface CustomFieldDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  newField: Partial<CustomField>;
  setNewField: (field: Partial<CustomField>) => void;
  handleSaveFieldsSettings: () => void;
}

export const CustomFieldDialog = ({
  isOpen,
  onOpenChange,
  isEditing,
  newField,
  setNewField,
  handleSaveFieldsSettings,
}: CustomFieldDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Campo Personalizado" : "Cadastre Campos Personalizados"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifique as informações do campo personalizado"
              : "Adicione campos que serão extraídos das chamadas"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Campo</label>
                <Input
                  value={newField.name || ""}
                  onChange={(e) =>
                    setNewField({ ...newField, name: e.target.value })
                  }
                  placeholder="Ex: Interesse do Lead"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição</label>
                <Input
                  value={newField.description || ""}
                  onChange={(e) =>
                    setNewField({ ...newField, description: e.target.value })
                  }
                  placeholder="Ex: Nível de interesse demonstrado durante a chamada"
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isRequired"
                  checked={newField.isRequired || false}
                  onChange={(e) =>
                    setNewField({ ...newField, isRequired: e.target.checked })
                  }
                />
                <label htmlFor="isRequired" className="text-sm">
                  Campo obrigatório
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="default"
              onClick={handleSaveFieldsSettings}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Configurações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
