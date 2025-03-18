
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PromptFormFieldsProps {
  name: string;
  description: string;
  content: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onContentChange: (value: string) => void;
}

export const PromptFormFields = ({ 
  name, 
  description, 
  content, 
  onNameChange, 
  onDescriptionChange, 
  onContentChange 
}: PromptFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Nome do Prompt
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Ex: Análise de Sentimento"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Descrição da Finalidade
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
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
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Digite o conteúdo do prompt..."
          className="min-h-[150px] resize-none"
        />
      </div>
    </>
  );
};
