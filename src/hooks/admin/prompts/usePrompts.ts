
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Prompt } from "@/types/prompt";
import { supabase } from "@/integrations/supabase/client";

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

export const usePrompts = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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
        } as Prompt;
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

  useEffect(() => {
    fetchPrompts();
  }, []);

  return {
    prompts,
    isLoading,
    fetchPrompts
  };
};
