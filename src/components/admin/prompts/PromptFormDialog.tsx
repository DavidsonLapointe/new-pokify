
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Prompt } from "@/types/prompt";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { CompanyLeadly } from "@/types/company-leadly";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";

interface PromptFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: Omit<Prompt, "id"> & { module: string; company_id?: string };
  onPromptChange: (prompt: Omit<Prompt, "id"> & { module: string; company_id?: string }) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
  modules: { id: string; name: string; icon: string }[];
}

// Mock company data for testing
const mockCompanies: CompanyLeadly[] = [
  {
    id: "1",
    razao_social: "Empresa Teste S.A.",
    nome_fantasia: "Empresa Teste",
    cnpj: "12.345.678/0001-90",
    email: "contato@empresateste.com",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    razao_social: "Comércio Digital LTDA",
    nome_fantasia: "ComDig",
    cnpj: "98.765.432/0001-21",
    email: "contato@comdig.com",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "3",
    razao_social: "Soluções Integradas Brasil S.A.",
    nome_fantasia: "SIB Tecnologia",
    cnpj: "45.678.901/0001-23",
    email: "contato@sibtec.com",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "4",
    razao_social: "Indústria Nova Era LTDA",
    nome_fantasia: "Nova Era",
    cnpj: "34.567.890/0001-45",
    email: "contato@novaera.com",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "5",
    razao_social: "Tecnologia Avançada S.A.",
    nome_fantasia: "TecAv",
    cnpj: "23.456.789/0001-67",
    email: "contato@tecav.com",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const PromptFormDialog = ({
  open,
  onOpenChange,
  prompt,
  onPromptChange,
  onSave,
  onCancel,
  isEditing,
  modules,
}: PromptFormDialogProps) => {
  const [companies, setCompanies] = useState<CompanyLeadly[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && prompt.type === "custom") {
      fetchCompanies();
    }
  }, [open, prompt.type]);

  const fetchCompanies = async () => {
    setIsLoadingCompanies(true);
    
    try {
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('company_leadly')
        .select('*')
        .order('nome_fantasia', { ascending: true });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setCompanies(data);
        setUseMockData(false);
      } else {
        // If no data from Supabase, use mock data
        setCompanies(mockCompanies);
        setUseMockData(true);
        console.log("Usando dados mockados para empresas");
      }
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      // Fall back to mock data on error
      setCompanies(mockCompanies);
      setUseMockData(true);
      console.log("Erro ao buscar empresas, usando dados mockados");
      
      toast({
        title: "Aviso",
        description: "Usando dados de exemplo para empresas.",
        variant: "default",
      });
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Prompt" : "Novo Prompt"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nome do Prompt
            </label>
            <Input
              id="name"
              value={prompt.name}
              onChange={(e) =>
                onPromptChange({ ...prompt, name: e.target.value })
              }
              placeholder="Ex: Análise de Sentimento"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Tipo de Prompt
            </label>
            <div className="bg-muted/50 p-3 rounded-md mb-3 text-sm">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Tipos de Prompt:</p>
                  <p className="mb-1"><strong>Global:</strong> Disponível para todas as empresas no sistema. Útil para funcionalidades padrão que podem ser usadas por qualquer cliente.</p>
                  <p><strong>Customizado:</strong> Específico para uma única empresa. Permite criar prompts personalizados para necessidades particulares de um cliente.</p>
                </div>
              </div>
            </div>
            <RadioGroup 
              value={prompt.type} 
              onValueChange={(value) => onPromptChange({ ...prompt, type: value, company_id: value === "custom" ? prompt.company_id : undefined })}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="global" id="global" />
                <Label htmlFor="global">Global</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom">Customizado</Label>
              </div>
            </RadioGroup>
          </div>
          
          {prompt.type === "custom" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Empresa
              </label>
              {useMockData && (
                <div className="text-xs text-muted-foreground mb-2">
                  Exibindo dados de exemplo para demonstração
                </div>
              )}
              <Select 
                value={prompt.company_id}
                onValueChange={(value) => onPromptChange({ ...prompt, company_id: value })}
                disabled={isLoadingCompanies}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.nome_fantasia || company.razao_social}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Módulo
            </label>
            <Select 
              value={prompt.module}
              onValueChange={(value) => onPromptChange({ ...prompt, module: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um módulo" />
              </SelectTrigger>
              <SelectContent>
                {modules.map((module) => (
                  <SelectItem key={module.id} value={module.id}>
                    {module.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Descrição da Finalidade
            </label>
            <Textarea
              id="description"
              value={prompt.description}
              onChange={(e) =>
                onPromptChange({ ...prompt, description: e.target.value })
              }
              placeholder="Descreva brevemente a finalidade do prompt..."
              className="resize-none"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Conteúdo do Prompt
            </label>
            <Textarea
              id="content"
              value={prompt.content}
              onChange={(e) =>
                onPromptChange({ ...prompt, content: e.target.value })
              }
              placeholder="Digite o conteúdo do prompt..."
              className="min-h-[150px] resize-none"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="cancel" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={onSave}>
            {isEditing ? "Salvar Alterações" : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
