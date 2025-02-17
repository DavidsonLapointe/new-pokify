import OrganizationLayout from "@/components/OrganizationLayout";
import { useState } from "react";
import { toast } from "sonner";
import { CustomField, Funnel } from "@/components/settings/types";
import { FunnelSection } from "@/components/settings/FunnelSection";
import { CustomFieldsSection } from "@/components/settings/CustomFieldsSection";
import { NewFunnelDialog } from "@/components/settings/NewFunnelDialog";
import { NewStageDialog } from "@/components/settings/NewStageDialog";
import { CustomFieldDialog } from "@/components/settings/CustomFieldDialog";
import { AlertCircle, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Organization } from "@/types/organization";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const mockFunnels: Funnel[] = [];

const mockCurrentOrganization: Organization = {
  id: 1,
  name: "Tech Solutions",
  nomeFantasia: "Tech Solutions Ltda",
  plan: "Enterprise",
  users: [],
  status: "active",
  integratedCRM: null,
  integratedLLM: "GPT-4",
  email: "contact@techsolutions.com",
  phone: "(11) 1234-5678",
  cnpj: "12.345.678/0001-00",
  adminName: "João Silva",
  adminEmail: "joao@techsolutions.com"
};

const OrganizationSettings = () => {
  const navigate = useNavigate();
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [newField, setNewField] = useState<Partial<CustomField>>({});
  const [selectedFunnel, setSelectedFunnel] = useState<string>("");
  const [selectedStage, setSelectedStage] = useState<string>("");
  const [isFieldsDialogOpen, setIsFieldsDialogOpen] = useState(false);
  const [isEditingField, setIsEditingField] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [isFunnelDialogOpen, setIsFunnelDialogOpen] = useState(false);
  const [isStageDialogOpen, setIsStageDialogOpen] = useState(false);
  const [isNoFunnelAlertOpen, setIsNoFunnelAlertOpen] = useState(false);
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

  const handleNewStageClick = () => {
    if (funnels.length === 0) {
      setIsNoFunnelAlertOpen(true);
    } else {
      setIsStageDialogOpen(true);
    }
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
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Configurações</h1>
              <p className="text-muted-foreground">
                Configure os campos que serão extraídos automaticamente das chamadas
              </p>
            </div>
            
            {mockCurrentOrganization.integratedCRM ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                <Check className="h-5 w-5" />
                <span className="text-sm font-medium">
                  Integrado com {mockCurrentOrganization.integratedCRM}
                </span>
              </div>
            ) : (
              <Button
                variant="outline"
                className="flex items-center gap-2 text-yellow-600 border-yellow-200 bg-yellow-50 hover:bg-yellow-100 hover:text-yellow-700"
                onClick={() => navigate("/organization/integrations")}
              >
                <AlertCircle className="h-4 w-4" />
                <span>Integração com CRM Pendente</span>
                <ExternalLink className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>

        <FunnelSection
          funnels={funnels}
          selectedFunnel={selectedFunnel}
          selectedStage={selectedStage}
          setSelectedFunnel={setSelectedFunnel}
          setSelectedStage={setSelectedStage}
          setIsFunnelDialogOpen={setIsFunnelDialogOpen}
          setIsStageDialogOpen={handleNewStageClick}
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

        <AlertDialog open={isNoFunnelAlertOpen} onOpenChange={setIsNoFunnelAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Nenhum Funil Cadastrado</AlertDialogTitle>
              <AlertDialogDescription>
                Para cadastrar uma nova etapa, é necessário primeiro criar pelo menos um funil.
                Clique no botão "Novo Funil" ao lado para criar um.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                setIsNoFunnelAlertOpen(false);
                setIsFunnelDialogOpen(true);
              }}>
                Criar Novo Funil
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationSettings;
