
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Call, StatusMap } from "@/types/calls";
import { FileText, PlayCircle, Video } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { ProcessingOverlay } from "./ProcessingOverlay";

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
  const [showProcessDialog, setShowProcessDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");
  
  const StatusIcon = status.icon;
  const MediaIcon = call.mediaType === "video" ? Video : PlayCircle;

  const simulateProcessing = async () => {
    // Simulando um processamento assíncrono com 50% de chance de sucesso
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(Math.random() > 0.5);
      }, 2000);
    });
  };

  const handleReprocess = () => {
    setShowReprocessDialog(true);
  };

  const handleProcess = () => {
    setShowProcessDialog(true);
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

  const confirmProcess = async () => {
    setShowProcessDialog(false);
    setIsProcessing(true);
    setProcessingMessage("Processando chamada...");
    
    toast({
      title: "Processando chamada",
      description: "Aguarde enquanto a chamada é processada...",
      duration: 3000,
    });

    try {
      const success = await simulateProcessing();
      const newStatus = success ? "success" : "failed";
      
      onStatusUpdate?.(call.id, newStatus);
      
      toast({
        title: success ? "Processamento concluído" : "Erro no processamento",
        description: success 
          ? "A chamada foi processada com sucesso."
          : "Ocorreu um erro durante o processamento da chamada.",
        variant: success ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Erro no processamento",
        description: "Ocorreu um erro inesperado durante o processamento.",
        variant: "destructive",
      });
      onStatusUpdate?.(call.id, "failed");
    } finally {
      setIsProcessing(false);
      setProcessingMessage("");
    }
  };

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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMediaPlay(call)}
              className="hover:text-primary h-7 w-7"
            >
              <MediaIcon className="h-4 w-4" />
            </Button>
            
            {call.status === "success" && call.analysis && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onViewAnalysis(call)}
                className="h-7 w-7"
              >
                <FileText className="h-4 w-4" />
              </Button>
            )}

            {call.status === "failed" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReprocess}
                disabled={isProcessing}
                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors text-[11px] h-6 px-2"
              >
                {isProcessing ? "Reprocessando..." : "Reprocessar"}
              </Button>
            )}

            {call.status === "pending" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleProcess}
                disabled={isProcessing}
                className="text-yellow-600 border-yellow-200 hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-300 transition-colors text-[11px] h-6 px-2"
              >
                {isProcessing ? "Processando..." : "Processar"}
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>

      <AlertDialog open={showReprocessDialog} onOpenChange={setShowReprocessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reprocessar chamada</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja reprocessar esta chamada? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReprocess}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Reprocessar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showProcessDialog} onOpenChange={setShowProcessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Processar chamada</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja processar esta chamada? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmProcess}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Processar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ProcessingOverlay 
        isVisible={isProcessing} 
        message={processingMessage}
      />
    </>
  );
};
