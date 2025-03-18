
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
  const { toast } = useToast();

  useEffect(() => {
    if (open && prompt.type === "custom") {
      fetchCompanies();
    }
  }, [open, prompt.type]);

  const fetchCompanies = async () => {
    setIsLoadingCompanies(true);
    try {
      const { data, error } = await supabase
        .from('company_leadly')
        .select('*')
        .order('nome_fantasia', { ascending: true });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de empresas.",
        variant: "destructive",
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
