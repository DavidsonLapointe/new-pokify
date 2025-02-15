
import { Call, StatusMap } from "@/types/calls";
import { LeadCalls } from "./types";
import { getLeadName, getLeadDetails } from "./utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlayCircle, FileText, RefreshCw } from "lucide-react";
import { useState } from "react";
import { LeadDetailsDialog } from "./LeadDetailsDialog";
import { LeadTemperatureBadge } from "./LeadTemperatureBadge";
import { useToast } from "@/components/ui/use-toast";

interface CallHistoryProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLead: LeadCalls | null;
  statusMap: StatusMap;
  onPlayAudio: (audioUrl: string) => void;
  onViewAnalysis: (call: Call) => void;
  formatDate: (date: string) => string;
}

export const CallHistory = ({
  isOpen,
  onOpenChange,
  selectedLead,
  statusMap,
  onPlayAudio,
  onViewAnalysis,
  formatDate,
}: CallHistoryProps) => {
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  const [processingCallId, setProcessingCallId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleProcessCall = async (call: Call) => {
    setProcessingCallId(call.id);
    
    try {
      // Simulate API call for processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Randomly succeed or fail for demonstration
      const success = Math.random() > 0.5;
      
      if (success) {
        toast({
          title: "Chamada processada com sucesso",
          description: "A análise foi concluída e está disponível para visualização.",
        });
        // Here you would update the call status in your state management
      } else {
        throw new Error("Falha no processamento");
      }
    } catch (error) {
      toast({
        title: "Erro no processamento",
        description: "Não foi possível processar a chamada. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setProcessingCallId(null);
    }
  };

  // Example calls for demonstration
  const exampleCalls: Call[] = selectedLead ? [
    {
      id: "1",
      leadId: selectedLead.id,
      date: "2024-03-10T10:00:00",
      duration: "5:23",
      status: "success",
      phone: "(11) 99999-9999",
      seller: "João Silva",
      audioUrl: "#",
      leadInfo: selectedLead.calls[0].leadInfo,
      analysis: {
        transcription: "Exemplo de transcrição",
        summary: "Resumo da chamada",
        sentiment: {
          temperature: "warm",
          reason: "Cliente demonstrou interesse"
        },
        leadInfo: selectedLead.calls[0].leadInfo
      }
    },
    {
      id: "2",
      leadId: selectedLead.id,
      date: "2024-03-11T14:30:00",
      duration: "3:45",
      status: "failed",
      phone: "(11) 99999-9999",
      seller: "Maria Santos",
      audioUrl: "#",
      leadInfo: selectedLead.calls[0].leadInfo
    },
    {
      id: "3",
      leadId: selectedLead.id,
      date: "2024-03-12T16:15:00",
      duration: "4:12",
      status: "pending",
      phone: "(11) 99999-9999",
      seller: "Pedro Oliveira",
      audioUrl: "#",
      leadInfo: selectedLead.calls[0].leadInfo
    }
  ] : [];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <DialogTitle className="text-lg">
                Histórico de Chamadas - {selectedLead ? getLeadName(selectedLead) : ""}
              </DialogTitle>
              {selectedLead && (
                <>
                  <LeadTemperatureBadge
                    calls={selectedLead.calls}
                    hasProcessed={selectedLead.calls.some(call => call.status === "success")}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowLeadDetails(true)}
                    className="h-8 w-8"
                  >
                    <FileText className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
            <DialogDescription className="text-sm mt-2">
              {getLeadDetails(selectedLead)}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Data e Hora</TableHead>
                  <TableHead className="text-xs">Vendedor</TableHead>
                  <TableHead className="text-xs">Duração</TableHead>
                  <TableHead className="text-xs">Status da Chamada</TableHead>
                  <TableHead className="text-xs">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exampleCalls.map((call) => {
                  const status = statusMap[call.status];
                  const StatusIcon = status.icon;
                  const isProcessing = processingCallId === call.id;

                  return (
                    <TableRow key={call.id} className="text-xs">
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
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onPlayAudio(call.audioUrl)}
                            className="hover:text-primary h-7 w-7"
                          >
                            <PlayCircle className="h-4 w-4" />
                          </Button>
                          
                          {call.status === "success" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onViewAnalysis(call)}
                              className="hover:text-primary h-7 w-7"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          )}

                          {call.status === "failed" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleProcessCall(call)}
                              disabled={isProcessing}
                              className="h-7"
                            >
                              {isProcessing ? "Reprocessando..." : "Reprocessar"}
                            </Button>
                          )}

                          {call.status === "pending" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleProcessCall(call)}
                              disabled={isProcessing}
                              className="h-7"
                            >
                              {isProcessing ? "Processando..." : "Processar"}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {selectedLead && (
        <LeadDetailsDialog
          isOpen={showLeadDetails}
          onClose={() => setShowLeadDetails(false)}
          lead={selectedLead}
        />
      )}
    </>
  );
};
