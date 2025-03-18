import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Prompt } from "@/types/prompt";
import { EmptyPromptState } from "@/components/admin/prompts/EmptyPromptState";
import { PromptCard } from "@/components/admin/prompts/PromptCard";
import { ViewPromptDialog } from "@/components/admin/prompts/ViewPromptDialog";
import { PromptFormDialog } from "@/components/admin/prompts/PromptFormDialog";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { iconMap } from "@/components/admin/modules/module-constants";

// Define a type for module grouping
type ModuleGroup = {
  name: string;
  icon: React.ElementType;
  prompts: Prompt[];
};

// Define type for our newPrompt state to ensure consistent type usage
type PromptFormData = Omit<Prompt, "id"> & { 
  module: string; 
  company_id?: string;
};

// Sample prompts for demonstration
const samplePrompts: Omit<Prompt, "id">[] = [
  // Global prompts
  {
    name: "Análise de Sentimento",
    content: "Analise o sentimento do seguinte texto e classifique como positivo, negativo ou neutro. Forneça uma pontuação de sentimento entre -10 (extremamente negativo) e +10 (extremamente positivo). Explique as razões para sua classificação.\n\nTexto: {{texto}}",
    description: "Identifica se um texto tem sentimento positivo, negativo ou neutro com pontuação de -10 a +10",
    type: "global",
    module: "analise"
  },
  {
    name: "Resumo Executivo",
    content: "Crie um resumo executivo do seguinte documento em até 3 parágrafos, destacando os pontos mais importantes e as conclusões principais.\n\nDocumento: {{documento}}",
    description: "Gera um resumo conciso e objetivo de documentos extensos para executivos",
    type: "global",
    module: "geral"
  },
  {
    name: "Sugestões de Melhoria para Vídeos",
    content: "Avalie o seguinte script de vídeo e sugira 5 melhorias específicas para torná-lo mais envolvente, informativo e otimizado para o algoritmo do YouTube.\n\nScript: {{script}}",
    description: "Fornece dicas para aprimorar scripts de vídeo e melhorar seu desempenho",
    type: "global",
    module: "video"
  },
  // Custom prompts
  {
    name: "Análise de Concorrentes Tecnológicos",
    content: "Faça uma análise detalhada dos seguintes concorrentes no setor de tecnologia, destacando pontos fortes, pontos fracos, oportunidades e ameaças para nossa empresa. Considere aspectos como modelo de negócio, diferencial competitivo e estratégia de mercado.\n\nConcorrentes: {{concorrentes}}",
    description: "Análise SWOT personalizada para empresas de tecnologia",
    type: "custom",
    module: "analise",
    company_id: "1"
  },
  {
    name: "Roteiro de Atendimento ComDig",
    content: "Crie um roteiro de atendimento ao cliente para a ComDig, seguindo nossos valores de eficiência, empatia e resolução rápida. O roteiro deve incluir saudação inicial, perguntas de diagnóstico, abordagem para resolução de problemas comuns e despedida.\n\nTipo de atendimento: {{tipo_atendimento}}",
    description: "Roteiro personalizado para equipe de suporte da ComDig",
    type: "custom",
    module: "chat",
    company_id: "2"
  },
  {
    name: "Análise de Tendências SIB",
    content: "Analise as tendências de mercado para a SIB Tecnologia no setor de {{setor}}. Considere inovações recentes, movimentações de grandes players, oportunidades emergentes e possíveis ameaças. Apresente 3 recomendações estratégicas baseadas nesta análise.",
    description: "Monitoramento personalizado de tendências para a SIB Tecnologia",
    type: "custom",
    module: "analise",
    company_id: "3"
  }
];

const AdminPrompt = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [newPrompt, setNewPrompt] = useState<PromptFormData>({ 
    name: "", 
    content: "", 
    description: "",
    type: "global",
    module: "geral",
    company_id: undefined
  });
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("global");
  const { toast } = useToast();

  // Definir os módulos disponíveis no sistema
  const availableModules: { id: string; name: string; icon: keyof typeof iconMap }[] = [
    { id: "geral", name: "Geral", icon: "Blocks" },
    { id: "chat", name: "Chat AI Assistente", icon: "MessageCircle" },
    { id: "video", name: "Criador de Vídeos", icon: "Video" },
    { id: "audio", name: "Transcrição de Áudio", icon: "Headphones" },
    { id: "crm", name: "CRM Inteligente", icon: "UserRound" },
    { id: "analise", name: "Análise de Tendências", icon: "LineChart" }
  ];

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      let promptsData = data.map(prompt => {
        // Safely extract metadata values with proper type handling
        let moduleValue = 'geral'; // default value
        let companyId = undefined;
        
        if (prompt.metadata && 
            typeof prompt.metadata === 'object' && 
            !Array.isArray(prompt.metadata)) {
          
          if ('module' in prompt.metadata) {
            moduleValue = prompt.metadata.module as string;
          }
          
          if ('company_id' in prompt.metadata) {
            companyId = prompt.metadata.company_id as string;
          }
        }
        
        return {
          id: prompt.id,
          name: prompt.name,
          content: prompt.content,
          description: prompt.description || '',
          type: prompt.type,
          module: moduleValue,
          company_id: companyId
        };
      });

      // If no prompts found, add sample prompts
      if (promptsData.length === 0) {
        console.log("No prompts found, adding sample data");
        
        // Create sample prompts with temporary IDs
        promptsData = samplePrompts.map((prompt, index) => ({
          ...prompt,
          id: `sample-${index + 1}` // Temporary ID for frontend display only
        }));
      }

      setPrompts(promptsData);
    } catch (error) {
      console.error('Erro ao buscar prompts:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os prompts.",
        variant: "destructive",
      });
      
      // Add sample prompts even on error for demonstration
      const sampleData = samplePrompts.map((prompt, index) => ({
        ...prompt,
        id: `sample-${index + 1}`
      }));
      setPrompts(sampleData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPrompt = () => {
    setNewPrompt({ 
      name: "", 
      content: "", 
      description: "", 
      type: "global", 
      module: "geral", 
      company_id: undefined 
    });
    setIsEditing(false);
    setSelectedPrompt(null);
    setIsModalOpen(true);
  };

  const handleSavePrompt = async () => {
    if (!newPrompt.name.trim() || !newPrompt.content.trim() || !newPrompt.description.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    if (newPrompt.type === "custom" && !newPrompt.company_id) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma empresa para o prompt customizado.",
        variant: "destructive",
      });
      return;
    }

    try {
      const metadata: Record<string, any> = { 
        module: newPrompt.module 
      };
      
      // Adicionar company_id ao metadata apenas para prompts customizados
      if (newPrompt.type === "custom" && newPrompt.company_id) {
        metadata.company_id = newPrompt.company_id;
      }
      
      if (isEditing && selectedPrompt) {
        const { error } = await supabase
          .from('prompts')
          .update({
            name: newPrompt.name,
            content: newPrompt.content,
            description: newPrompt.description,
            type: newPrompt.type,
            metadata
          })
          .eq('id', selectedPrompt.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Prompt atualizado com sucesso!",
        });
      } else {
        const { error } = await supabase
          .from('prompts')
          .insert({
            name: newPrompt.name,
            content: newPrompt.content,
            description: newPrompt.description,
            type: newPrompt.type,
            metadata
          });

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Prompt cadastrado com sucesso!",
        });
      }

      handleCancel();
      fetchPrompts();
    } catch (error) {
      console.error('Erro ao salvar prompt:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o prompt.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setNewPrompt({ 
      name: "", 
      content: "", 
      description: "", 
      type: "global", 
      module: "geral", 
      company_id: undefined 
    });
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedPrompt(null);
  };

  const handleEdit = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setNewPrompt({
      name: prompt.name,
      content: prompt.content,
      description: prompt.description,
      type: prompt.type,
      module: prompt.module || 'geral',
      company_id: prompt.company_id
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleView = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setIsViewModalOpen(true);
  };

  // Fix the type mismatch by properly handling the prompt change
  const handlePromptChange = (updatedPrompt: PromptFormData) => {
    setNewPrompt(updatedPrompt);
  };

  // Agrupar os prompts por módulo e tipo
  const groupPromptsByModule = (type: string): ModuleGroup[] => {
    const filteredPrompts = prompts.filter(prompt => prompt.type === type);
    
    return availableModules.map(module => ({
      name: module.name,
      icon: iconMap[module.icon],
      prompts: filteredPrompts.filter(prompt => prompt.module === module.id)
    })).filter(group => group.prompts.length > 0);
  };

  const globalPromptGroups = groupPromptsByModule('global');
  const customPromptGroups = groupPromptsByModule('custom');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Prompts</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus prompts de IA
          </p>
        </div>
        <Button onClick={handleNewPrompt}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Prompt
        </Button>
      </div>

      <Tabs defaultValue="global" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="global">Prompts Globais</TabsTrigger>
          <TabsTrigger value="custom">Prompts Customizados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="global" className="space-y-6">
          {!isLoading && globalPromptGroups.length === 0 ? (
            <EmptyPromptState />
          ) : (
            globalPromptGroups.map((group, index) => (
              <div key={group.name} className="space-y-4">
                <div className="flex items-center gap-2 mt-6">
                  <group.icon className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-medium">{group.name}</h2>
                </div>
                <Separator className="my-2" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {group.prompts.map((prompt) => (
                    <PromptCard
                      key={prompt.id}
                      prompt={prompt}
                      onEdit={handleEdit}
                      onView={handleView}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          {!isLoading && customPromptGroups.length === 0 ? (
            <EmptyPromptState />
          ) : (
            customPromptGroups.map((group, index) => (
              <div key={group.name} className="space-y-4">
                <div className="flex items-center gap-2 mt-6">
                  <group.icon className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-medium">{group.name}</h2>
                </div>
                <Separator className="my-2" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {group.prompts.map((prompt) => (
                    <PromptCard
                      key={prompt.id}
                      prompt={prompt}
                      onEdit={handleEdit}
                      onView={handleView}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>

      <ViewPromptDialog
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        prompt={selectedPrompt}
      />

      <PromptFormDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        prompt={newPrompt}
        onPromptChange={handlePromptChange}
        onSave={handleSavePrompt}
        onCancel={handleCancel}
        isEditing={isEditing}
        modules={availableModules}
      />
    </div>
  );
};

export default AdminPrompt;
