
import { Call } from "@/types/calls";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageSquare, FileText } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AIInteractionsCountProps {
  calls: Call[];
}

export const AIInteractionsCount = ({ calls }: AIInteractionsCountProps) => {
  // Contando diferentes tipos de interações
  const callAnalysisCount = calls.filter(call => 
    call.status === "success" && call.analysis?.summary).length;
  
  const chatAnalysisCount = calls.filter(call => 
    call.status === "success" && call.analysis?.chatMessages?.length).length;
  
  const reportCount = calls.filter(call => 
    call.status === "success" && call.analysis?.report).length;

  if (callAnalysisCount === 0 && chatAnalysisCount === 0 && reportCount === 0) {
    return <span className="text-xs text-gray-400">Nenhuma</span>;
  }

  return (
    <TooltipProvider>
      <div className="flex space-x-1">
        {callAnalysisCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 px-1.5 py-0.5">
                <Phone className="h-3 w-3 mr-1" />{callAnalysisCount}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{callAnalysisCount} análises de chamadas</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        {chatAnalysisCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700 px-1.5 py-0.5">
                <MessageSquare className="h-3 w-3 mr-1" />{chatAnalysisCount}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{chatAnalysisCount} conversas por chat</p>
            </TooltipContent>
          </Tooltip>
        )}

        {reportCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700 px-1.5 py-0.5">
                <FileText className="h-3 w-3 mr-1" />{reportCount}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{reportCount} relatórios gerados</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};
