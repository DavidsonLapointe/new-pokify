
import OrganizationLayout from "@/components/OrganizationLayout";
import { useState } from "react";
import { toast } from "sonner";
import { CustomField, Funnel } from "@/components/settings/types";
import { FunnelSection } from "@/components/settings/FunnelSection";
import { CustomFieldsSection } from "@/components/settings/CustomFieldsSection";
import { NewFunnelDialog } from "@/components/settings/NewFunnelDialog";
import { NewStageDialog } from "@/components/settings/NewStageDialog";
import { CustomFieldDialog } from "@/components/settings/CustomFieldDialog";

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

  return (
    <OrganizationLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Configure os campos que serão extraídos automaticamente das chamadas
          </p>
        </div>

        <FunnelSection
          funnels={funnels}
          selectedFunnel={selectedFunnel}
          selectedStage={selectedStage}
          setSelectedFunnel={setSelectedFunnel}
          setSelectedStage={setSelectedStage}
          setIsFunnelDialogOpen={setIsFunnelDialogOpen}
          setIsStageDialogOpen={setIsStageDialogOpen}
        />

        <CustomFieldsSection
          customFields={customFields}
          handleOpenNewField={handleOpenNewField}
          handleOpenEditField={handleOpenEditField}
        />

        <NewFunnelDialog
          isOpen={isFunnelDialogOpen}
          onOpenChange={setIsFunnelDialogOpen}
          newFunnel={newFunnel}
          setNewFunnel={setNewFunnel}
          handleSaveFunnel={handleSaveFunnel}
        />

        <NewStageDialog
          isOpen={isStageDialogOpen}
          onOpenChange={setIsStageDialogOpen}
          newStage={newStage}
          setNewStage={setNewStage}
          newStageFunnelId={newStageFunnelId}
          setNewStageFunnelId={setNewStageFunnelId}
          handleSaveStage={handleSaveStage}
          funnels={funnels}
        />

        <CustomFieldDialog
          isOpen={isFieldsDialogOpen}
          onOpenChange={setIsFieldsDialogOpen}
          isEditing={isEditingField}
          newField={newField}
          setNewField={setNewField}
          handleSaveFieldsSettings={handleSaveFieldsSettings}
        />
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationSettings;
