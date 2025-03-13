
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Video, 
  Headphones, 
  UserRound, 
  MessageCircle, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Info,
  HelpCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const AIToolsPage = () => {
  const [selectedTool, setSelectedTool] = useState<string>("video");

  const tools = [
    {
      id: "video",
      title: "Prospecção com Vídeo",
      icon: Video,
      description: "Crie vídeos personalizados para prospecção, usando IA para personalizar a mensagem.",
      locked: false
    },
    {
      id: "inbound",
      title: "Atendente Inbound",
      icon: Headphones,
      description: "Atendimento automatizado para leads inbound com IA conversacional.",
      locked: true
    },
    {
      id: "call",
      title: "Análise de Call",
      icon: UserRound,
      description: "Análise automática de chamadas para identificar padrões e insights.",
      locked: false
    },
    {
      id: "nutrition",
      title: "Nutrição de leads (MKT)",
      icon: MessageCircle,
      description: "Automação de campanhas de nutrição de leads com conteúdo personalizado.",
      locked: true
    },
    {
      id: "assistant",
      title: "Assistente de Prospecção",
      icon: ShieldCheck,
      description: "Assistente virtual para auxiliar na prospecção de novos clientes.",
      locked: false
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Ferramentas de IA</h1>
        <p className="text-gray-500">Ferramentas de IA para otimizar seu processo de vendas</p>
      </div>

      <div>
        <p className="text-gray-600 mb-4">Escolha uma das ferramentas abaixo para otimizar seu processo de vendas:</p>
        
        <div className="relative">
          <div className="flex items-center space-x-4 overflow-x-auto py-4 px-1">
            <button 
              className="absolute left-0 z-10 bg-white/80 rounded-full p-1 shadow-md"
              aria-label="Deslizar para esquerda"
            >
              <ChevronLeft size={20} />
            </button>
            
            {tools.map((tool) => (
              <Card 
                key={tool.id}
                className={`min-w-[180px] cursor-pointer transition-all ${
                  selectedTool === tool.id ? 'bg-[#F1F0FB] border-[#9b87f5]' : 'bg-white'
                }`}
                onClick={() => setSelectedTool(tool.id)}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center space-y-3">
                  <div className={`p-2 rounded-md ${selectedTool === tool.id ? 'text-[#9b87f5]' : 'text-gray-500'}`}>
                    {tool.locked && (
                      <div className="absolute top-2 right-2">
                        <span className="text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                        </span>
                      </div>
                    )}
                    <tool.icon size={32} />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{tool.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <button 
              className="absolute right-0 z-10 bg-white/80 rounded-full p-1 shadow-md"
              aria-label="Deslizar para direita"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Detalhes da ferramenta selecionada */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <Video className="text-[#9b87f5]" />
          <h2 className="text-lg font-semibold">Prospecção com Vídeo</h2>
          <Badge variant="outline" className="bg-green-100 text-green-700 ml-auto">
            Ativo
          </Badge>
        </div>
        
        <p className="text-gray-600 mb-4">
          Crie vídeos personalizados para prospecção, usando IA para personalizar a mensagem.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-600 text-sm mb-6">
          Crie vídeos personalizados para seus leads utilizando IA. O sistema pode gerar um roteiro baseado no perfil do lead e 
          automaticamente criar vídeos com seu avatar digital.
        </div>

        <div className="flex gap-4 mb-6">
          <Button variant="outline" className="flex items-center gap-2">
            <Info size={18} />
            Como Funciona
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <HelpCircle size={18} />
            Benefícios
          </Button>
        </div>

        <Button className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] flex items-center justify-center gap-2">
          <Video size={18} />
          Criar novo vídeo
        </Button>
      </Card>
    </div>
  );
};

export default AIToolsPage;
