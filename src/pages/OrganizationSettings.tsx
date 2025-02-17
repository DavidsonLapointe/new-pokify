
import OrganizationLayout from "@/components/OrganizationLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CustomField {
  id: string;
  name: string;
  description: string;
  isRequired: boolean;
}

const OrganizationSettings = () => {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [newField, setNewField] = useState<Partial<CustomField>>({});
  const [isEditing, setIsEditing] = useState(false);

  const handleAddField = () => {
    if (!newField.name || !newField.description) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const field: CustomField = {
      id: crypto.randomUUID(),
      name: newField.name,
      description: newField.description,
      isRequired: newField.isRequired || false,
    };

    setCustomFields([...customFields, field]);
    setNewField({});
    setIsEditing(false);
    toast.success("Campo adicionado com sucesso");
  };

  const handleRemoveField = (id: string) => {
    setCustomFields(customFields.filter((field) => field.id !== id));
    toast.success("Campo removido com sucesso");
  };

  const handleSaveSettings = () => {
    // Aqui implementaria a lógica para salvar as configurações
    console.log("Campos salvos:", customFields);
    toast.success("Configurações salvas com sucesso");
  };

  return (
    <OrganizationLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Configure os campos que serão extraídos automaticamente das chamadas
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Campos Personalizados</CardTitle>
            <CardDescription>
              Defina os campos que serão extraídos pelo modelo LLM e enviados para seu CRM
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Lista de campos existentes */}
            <div className="space-y-4">
              {customFields.map((field) => (
                <div
                  key={field.id}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <h3 className="font-medium">{field.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {field.description}
                    </p>
                    {field.isRequired && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        Obrigatório
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveField(field.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Formulário para adicionar novo campo */}
            {isEditing ? (
              <div className="space-y-4 p-4 border rounded-lg">
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
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setNewField({});
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleAddField}>Adicionar Campo</Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsEditing(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Novo Campo
              </Button>
            )}

            {/* Botão de salvar configurações */}
            <div className="flex justify-end">
              <Button onClick={handleSaveSettings}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Configurações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationSettings;
