
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GitFork, PhoneIcon, PlayCircle, FileText } from "lucide-react";
import { Call, StatusMap } from "@/types/calls";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CallsTableProps {
  calls: Call[];
  statusMap: StatusMap;
  onPlayAudio: (audioUrl: string) => void;
  onViewAnalysis: (call: Call) => void;
  formatDate: (date: string) => string;
}

interface LeadCalls {
  id: string;
  personType: "pf" | "pj";
  firstName?: string;
  lastName?: string;
  razaoSocial?: string;
  calls: Call[];
  crmInfo?: {
    funnel: string;
    stage: string;
  };
}

export const CallsTable = ({
  calls,
  statusMap,
  onPlayAudio,
  onViewAnalysis,
  formatDate,
}: CallsTableProps) => {
  const [selectedLead, setSelectedLead] = useState<LeadCalls | null>(null);
  const [showCallsHistory, setShowCallsHistory] = useState(false);

  // Agrupa chamadas por lead
  const leadsWithCalls: LeadCalls[] = calls.reduce((leads: LeadCalls[], call) => {
    const existingLead = leads.find(lead => lead.id === call.leadId);
    
    if (existingLead) {
      existingLead.calls.push(call);
      return leads;
    }

    const newLead: LeadCalls = {
      id: call.leadId,
      personType: call.leadInfo.personType,
      firstName: call.leadInfo.firstName,
      lastName: call.leadInfo.lastName,
      razaoSocial: call.leadInfo.razaoSocial,
      calls: [call],
      crmInfo: call.crmInfo,
    };

    return [...leads, newLead];
  }, []);

  const getLeadName = (lead: LeadCalls) => {
    if (lead.personType === "pf") {
      return `${lead.firstName} ${lead.lastName || ""}`;
    }
    return lead.razaoSocial;
  };

  const getLeadStatus = (callCount: number) => {
    return callCount === 0 ? "pending" : "active";
  };

  const handleShowCallHistory = (lead: LeadCalls) => {
    setSelectedLead(lead);
    setShowCallsHistory(true);
  };

  return (
    <TooltipProvider>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px] text-xs whitespace-nowrap">Nome do Lead</TableHead>
              <TableHead className="w-[120px] text-xs whitespace-nowrap">Status do Lead</TableHead>
              <TableHead className="w-[120px] text-xs whitespace-nowrap">Qtde de Chamadas</TableHead>
              <TableHead className="w-[180px] text-xs whitespace-nowrap">Funil (CRM)</TableHead>
              <TableHead className="w-[100px] text-xs whitespace-nowrap">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leadsWithCalls.map((lead) => {
              const leadStatus = getLeadStatus(lead.calls.length);
              const successfulCalls = lead.calls.filter(call => call.status === "success").length;

              return (
                <TableRow key={lead.id} className="text-xs">
                  <TableCell className="py-2 whitespace-nowrap">
                    {getLeadName(lead)}
                  </TableCell>
                  <TableCell className="py-2 whitespace-nowrap">
                    <Badge
                      variant="secondary"
                      className={`flex items-center gap-0.5 w-fit text-[11px] px-1.5 py-0.5 ${
                        leadStatus === "active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {leadStatus === "active" ? "Ativo" : "Pendente"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2 whitespace-nowrap">
                    <Button
                      variant="link"
                      onClick={() => handleShowCallHistory(lead)}
                      className="p-0 h-auto font-medium"
                    >
                      {lead.calls.length}
                    </Button>
                  </TableCell>
                  <TableCell className="py-2 whitespace-nowrap">
                    {successfulCalls > 0 && lead.crmInfo ? (
                      <div className="flex items-center gap-1">
                        <GitFork className="w-3 h-3 text-muted-foreground" />
                        <span>
                          {lead.crmInfo.funnel}
                          <span className="text-muted-foreground mx-1">→</span>
                          {lead.crmInfo.stage}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="py-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {}} // Implementar ação de iniciar chamada
                      className="hover:text-primary h-7 w-7"
                    >
                      <PhoneIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showCallsHistory} onOpenChange={setShowCallsHistory}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Histórico de Chamadas - {selectedLead ? getLeadName(selectedLead) : ""}
            </DialogTitle>
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
                {selectedLead?.calls.map((call) => {
                  const status = statusMap[call.status];
                  const StatusIcon = status.icon;

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
    </TooltipProvider>
  );
};
