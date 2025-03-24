
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Call } from "@/types/calls";
import { LeadCalls } from "./types";
import { Phone, MessageSquare, FileText } from "lucide-react";
import { getLeadName } from "./utils";

interface AIInteractionsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  lead: LeadCalls | null;
  formatDate: (date: string) => string;
}

export const AIInteractionsModal = ({ isOpen, onOpenChange, lead, formatDate }: AIInteractionsModalProps) => {
  if (!lead) return null;

  const successCalls = lead.calls.filter(call => call.status === "success");
  
  // Different types of AI interactions
  const callAnalyses = successCalls.filter(call => call.analysis?.summary);
  const chatInteractions = successCalls.filter(call => 
    call.analysis?.chatMessages && call.analysis.chatMessages.length > 0);
  const reportInteractions = successCalls.filter(call => call.analysis?.report);
  
  const hasInteractions = callAnalyses.length > 0 || chatInteractions.length > 0 || reportInteractions.length > 0;

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case "call":
        return <Phone className="h-4 w-4 text-blue-600" />;
      case "chat":
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      case "report":
        return <FileText className="h-4 w-4 text-amber-600" />;
      default:
        return null;
    }
  };

  const getInteractionTitle = (call: Call, type: string) => {
    switch (type) {
      case "call":
        return "Análise de chamada";
      case "chat":
        return "Conversa por chat";
      case "report":
        return "Relatório gerado";
      default:
        return "Interação";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Histórico de Interações IA - {getLeadName(lead)}
          </DialogTitle>
        </DialogHeader>

        {hasInteractions ? (
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-[150px]">Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {callAnalyses.map((call) => (
                  <TableRow key={`call-${call.id}`}>
                    <TableCell>{getInteractionIcon("call")}</TableCell>
                    <TableCell>{getInteractionTitle(call, "call")}</TableCell>
                    <TableCell>{formatDate(call.date)}</TableCell>
                  </TableRow>
                ))}
                
                {chatInteractions.map((call) => (
                  <TableRow key={`chat-${call.id}`}>
                    <TableCell>{getInteractionIcon("chat")}</TableCell>
                    <TableCell>{getInteractionTitle(call, "chat")}</TableCell>
                    <TableCell>{formatDate(call.date)}</TableCell>
                  </TableRow>
                ))}
                
                {reportInteractions.map((call) => (
                  <TableRow key={`report-${call.id}`}>
                    <TableCell>{getInteractionIcon("report")}</TableCell>
                    <TableCell>{getInteractionTitle(call, "report")}</TableCell>
                    <TableCell>{formatDate(call.date)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-500">
            Nenhuma interação de IA encontrada para este lead.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
