
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Call, StatusMap } from "@/types/calls";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProcessingOverlay } from "./ProcessingOverlay";
import { CallMediaButtons } from "./row/CallMediaButtons";
import { CallActionButtons } from "./row/CallActionButtons";
import { CallProcessingDialogs } from "./row/CallProcessingDialogs";

interface CallHistoryTableRowProps {
  call: Call;
  status: StatusMap[keyof StatusMap];
  onMediaPlay: (call: Call) => void;
  onViewAnalysis: (call: Call) => void;
  formatDate: (date: string) => string;
  onStatusUpdate?: (callId: string, newStatus: Call['status']) => void;
}

export const CallHistoryTableRow = ({
  call,
  status,
  onMediaPlay,
  onViewAnalysis,
  formatDate,
  onStatusUpdate,
}: CallHistoryTableRowProps) => {
  const { toast } = useToast();
  const [showReprocessDialog, setShowReprocessDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");
  
  const StatusIcon = status?.icon;

  const simulateProcessing = async () => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(Math.random() > 0.5);
      }, 2000);
    });
  };

  const handleReprocess = () => {
    setShowReprocessDialog(true);
  };

  const confirmReprocess = async () => {
    setShowReprocessDialog(false);
    setIsProcessing(true);
    setProcessingMessage("Reprocessando chamada...");
    
    toast({
      title: "Reprocessando chamada",
      description: "Aguarde enquanto a chamada é reprocessada...",
      duration: 3000,
    });

    try {
      const success = await simulateProcessing();
      const newStatus = success ? "success" : "failed";
      
      onStatusUpdate?.(call.id, newStatus);
      
      toast({
        title: success ? "Reprocessamento concluído" : "Erro no reprocessamento",
        description: success 
          ? "A chamada foi reprocessada com sucesso."
          : "Ocorreu um erro durante o reprocessamento da chamada.",
        variant: success ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Erro no reprocessamento",
        description: "Ocorreu um erro inesperado durante o reprocessamento.",
        variant: "destructive",
      });
      onStatusUpdate?.(call.id, "failed");
    } finally {
      setIsProcessing(false);
      setProcessingMessage("");
    }
  };

  // Se o status não estiver definido, não renderiza a linha
  if (!status) {
    console.error(`Status não encontrado para a chamada ${call.id} com status ${call.status}`);
    return null;
  }

  return (
    <>
      <TableRow className="text-xs">
        <TableCell className="py-2">{formatDate(call.date)}</TableCell>
        <TableCell className="py-2">{call.seller}</TableCell>
        <TableCell className="py-2">{call.duration}</TableCell>
        <TableCell className="py-2">
          <Badge
            variant="secondary"
            className={`flex items-center gap-0.5 w-fit text-[11px] px-1.5 py-0.5 ${status.color}`}
          >
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </Badge>
        </TableCell>
        <TableCell className="py-2">
          <div className="flex items-center gap-2">
            <CallMediaButtons
              call={call}
              onMediaPlay={onMediaPlay}
              onViewAnalysis={onViewAnalysis}
            />
            <CallActionButtons
              call={call}
              isProcessing={isProcessing}
              onReprocess={handleReprocess}
            />
          </div>
        </TableCell>
      </TableRow>

      <CallProcessingDialogs
        showReprocessDialog={showReprocessDialog}
        showProcessDialog={false}
        onReprocessDialogChange={setShowReprocessDialog}
        onProcessDialogChange={() => {}}
        onConfirmReprocess={confirmReprocess}
        onConfirmProcess={() => {}}
      />

      <ProcessingOverlay 
        isVisible={isProcessing} 
        message={processingMessage}
      />
    </>
  );
};
