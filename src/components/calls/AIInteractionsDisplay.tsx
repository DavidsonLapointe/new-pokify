
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LeadCalls } from "./types";
import { Bot, Headphones, MessageSquare, FilePieChart } from "lucide-react";

interface AIInteractionsDisplayProps {
  lead: LeadCalls;
}

type InteractionType = {
  name: string;
  icon: React.ReactNode;
  count: number;
  color: string;
};

export const AIInteractionsDisplay = ({ lead }: AIInteractionsDisplayProps) => {
  // Aqui extraímos os diferentes tipos de interações de IA das chamadas
  const interactions: InteractionType[] = [];
  
  // Verificar interações de chamada de áudio/vídeo
  const callInteractions = lead.calls.filter(call => 
    call.status === "success" && 
    (call.mediaType === "audio" || call.mediaType === "video")
  );
  
  if (callInteractions.length > 0) {
    interactions.push({
      name: "Chamadas Analisadas",
      icon: <Headphones className="h-3 w-3" />,
      count: callInteractions.length,
      color: "bg-blue-100 text-blue-800"
    });
  }
  
  // Verificar interações de chat (poderia vir de analysis ou outras propriedades)
  const chatInteractions = lead.calls.filter(call => 
    call.analysis?.transcription && call.status === "success"
  );
  
  if (chatInteractions.length > 0) {
    interactions.push({
      name: "Conversas Analisadas",
      icon: <MessageSquare className="h-3 w-3" />,
      count: chatInteractions.length,
      color: "bg-purple-100 text-purple-800"
    });
  }
  
  // Verificar relatórios gerados
  const reportInteractions = lead.calls.filter(call => 
    call.analysis?.summary && call.status === "success"
  );
  
  if (reportInteractions.length > 0) {
    interactions.push({
      name: "Relatórios Gerados",
      icon: <FilePieChart className="h-3 w-3" />,
      count: reportInteractions.length,
      color: "bg-green-100 text-green-800"
    });
  }

  // Se não houver interações, mostrar mensagem "Nenhuma interação"
  if (interactions.length === 0) {
    return <span className="text-muted-foreground">Nenhuma interação</span>;
  }

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-1">
        {interactions.map((interaction, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Badge 
                className={`${interaction.color} hover:${interaction.color} cursor-help flex items-center gap-1 px-2`}
              >
                {interaction.icon}
                <span>{interaction.count}</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{interaction.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};
