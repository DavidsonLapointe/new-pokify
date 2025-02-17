
import OrganizationLayout from "@/components/OrganizationLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save, ListChecks } from "lucide-react";
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Configurações</h1>
            <p className="text-muted-foreground">
              Configure os campos que serão extraídos automaticamente das chamadas
            </p>
          </div>
          <Button onClick={handleSaveSettings}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>

        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-primary" />
                  Campos Personalizados
                </CardTitle>
                <CardDescription>
                  Defina os campos que serão extraídos pelo modelo LLM
                </CardDescription>
              </div>
              {!isEditing && (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Campo
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {isEditing && (
              <div className="mb-6 p-4 border rounded-lg bg-muted/50">
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
                <div className="mt-4 flex items-center justify-between">
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
                  <div className="flex space-x-2">
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
              </div>
            )}

            {customFields.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {customFields.map((field) => (
                  <div
                    key={field.id}
                    className="relative group p-4 border rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium">{field.name}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveField(field.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {field.description}
                      </p>
                      {field.isRequired && (
                        <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          Obrigatório
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ListChecks className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nenhum campo personalizado configurado</p>
                <p className="text-sm">
                  Adicione campos para extrair informações das suas chamadas
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationSettings;
