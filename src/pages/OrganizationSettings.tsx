import OrganizationLayout from "@/components/OrganizationLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ListChecks, GitBranch, PenLine, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomField {
  id: string;
  name: string;
  description: string;
  isRequired: boolean;
}

interface Funnel {
  id: string;
  name: string;
  stages: Stage[];
}

interface Stage {
  id: string;
  name: string;
}

const mockFunnels = [
  {
    id: "1",
    name: "Funil de Vendas",
    stages: [
      { id: "1", name: "Qualificação" },
      { id: "2", name: "Apresentação" },
      { id: "3", name: "Proposta" },
      { id: "4", name: "Negociação" },
    ],
  },
  {
    id: "2",
    name: "Funil de Marketing",
    stages: [
      { id: "5", name: "Lead" },
      { id: "6", name: "MQL" },
      { id: "7", name: "SQL" },
    ],
  },
];

const OrganizationSettings = () => {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [newField, setNewField] = useState<Partial<CustomField>>({});
  const [isEditingFunnel, setIsEditingFunnel] = useState(false);
  const [selectedFunnel, setSelectedFunnel] = useState<string>("");
  const [selectedStage, setSelectedStage] = useState<string>("");
  const [isFieldsDialogOpen, setIsFieldsDialogOpen] = useState(false);
  const [isEditingField, setIsEditingField] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [isFunnelDialogOpen, setIsFunnelDialogOpen] = useState(false);
  const [isStageDialogOpen, setIsStageDialogOpen] = useState(false);
  const [newFunnel, setNewFunnel] = useState("");
  const [newStage, setNewStage] = useState("");
  const [newStageFunnelId, setNewStageFunnelId] = useState<string>("");
  const [funnels, setFunnels] = useState<Funnel[]>(mockFunnels);

  const handleOpenNewField = () => {
    setIsEditingField(false);
    setEditingFieldId(null);
    setNewField({});
    setIsFieldsDialogOpen(true);
  };

  const handleOpenEditField = (field: CustomField) => {
    setIsEditingField(true);
    setEditingFieldId(field.id);
    setNewField(field);
    setIsFieldsDialogOpen(true);
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
    setIsFieldsDialogOpen(false);
    setIsEditingField(false);
    setEditingFieldId(null);
  };

  const handleRemoveField = (id: string) => {
    setCustomFields(customFields.filter((field) => field.id !== id));
    toast.success("Campo removido com sucesso");
  };

  const handleSaveFunnel = () => {
    if (!newFunnel) {
      toast.error("Digite o nome do funil");
      return;
    }

    const funnel: Funnel = {
      id: crypto.randomUUID(),
      name: newFunnel,
      stages: [],
    };

    setFunnels([...funnels, funnel]);
    setNewFunnel("");
    setIsFunnelDialogOpen(false);
    toast.success("Funil criado com sucesso");
  };

  const handleSaveStage = () => {
    if (!newStageFunnelId || !newStage) {
      toast.error("Selecione um funil e digite o nome da etapa");
      return;
    }

    const updatedFunnels = funnels.map(funnel => {
      if (funnel.id === newStageFunnelId) {
        return {
          ...funnel,
          stages: [...funnel.stages, { id: crypto.randomUUID(), name: newStage }]
        };
      }
      return funnel;
    });

    setFunnels(updatedFunnels);
    setNewStage("");
    setNewStageFunnelId("");
    setIsStageDialogOpen(false);
    toast.success("Etapa criada com sucesso");
  };

  const handleSaveFunnelSettings = () => {
    setIsEditingFunnel(false);
    toast.success("Configurações do funil salvas com sucesso");
  };

  const currentFunnel = funnels.find((f) => f.id === selectedFunnel);

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
          <CardHeader className="border-b py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-primary" />
                  Funil do CRM
                </CardTitle>
                <CardDescription>
                  Define o funil e etapa padrão para novos leads no CRM
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  className="bg-[#000000e6] hover:bg-black/80"
                  onClick={() => setIsFunnelDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Funil
                </Button>
                <Button
                  className="bg-[#000000e6] hover:bg-black/80"
                  onClick={() => setIsStageDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Etapa
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Funil</label>
                <Select
                  value={selectedFunnel}
                  onValueChange={(value) => {
                    setSelectedFunnel(value);
                    setSelectedStage("");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um funil" />
                  </SelectTrigger>
                  <SelectContent>
                    {funnels.map((funnel) => (
                      <SelectItem key={funnel.id} value={funnel.id}>
                        {funnel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Etapa</label>
                <Select
                  value={selectedStage}
                  onValueChange={setSelectedStage}
                  disabled={!selectedFunnel}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma etapa" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentFunnel?.stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b py-4">
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
              <Button
                className="bg-[#000000e6] hover:bg-black/80"
                onClick={handleOpenNewField}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Campo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {customFields.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {customFields.map((field) => (
                  <div
                    key={field.id}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium">{field.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {field.description}
                        </p>
                        {field.isRequired && (
                          <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            Obrigatório
                          </span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEditField(field)}
                        className="hover:bg-muted"
                      >
                        <PenLine className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ListChecks className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nenhum campo personalizado configurado</p>
                <p className="text-sm">
                  Clique em Novo Campo para adicionar campos
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isFieldsDialogOpen} onOpenChange={setIsFieldsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {isEditingField ? "Editar Campo Personalizado" : "Cadastre Campos Personalizados"}
              </DialogTitle>
              <DialogDescription>
                {isEditingField 
                  ? "Modifique as informações do campo personalizado"
                  : "Adicione campos que serão extraídos das chamadas"
                }
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
                  className="bg-[#000000e6] hover:bg-black/80"
                  onClick={handleSaveFieldsSettings}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isFunnelDialogOpen} onOpenChange={setIsFunnelDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Novo Funil</DialogTitle>
              <DialogDescription>
                Cadastre um novo funil para organizar suas oportunidades
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Funil</label>
                <Input
                  placeholder="Ex: Funil de Vendas"
                  value={newFunnel}
                  onChange={(e) => setNewFunnel(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                className="bg-[#000000e6] hover:bg-black/80"
                onClick={handleSaveFunnel}
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Funil
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isStageDialogOpen} onOpenChange={setIsStageDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nova Etapa</DialogTitle>
              <DialogDescription>
                Defina o nome da etapa e vincule ao funil desejado para organizar o fluxo do seu processo
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome da Etapa</label>
                <Input
                  placeholder="Ex: Qualificação"
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Selecione o Funil</label>
                <Select
                  value={newStageFunnelId}
                  onValueChange={setNewStageFunnelId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um funil" />
                  </SelectTrigger>
                  <SelectContent>
                    {funnels.map((funnel) => (
                      <SelectItem key={funnel.id} value={funnel.id}>
                        {funnel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                className="bg-[#000000e6] hover:bg-black/80"
                onClick={handleSaveStage}
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Etapa
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationSettings;
