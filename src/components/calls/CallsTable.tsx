
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
import { GitFork, PhoneIcon, Flame, HelpCircle } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CallsTableProps, LeadCalls } from "./types";
import { CallHistory } from "./CallHistory";
import {
  getLeadName,
  getLeadStatus,
  getLastCallTemperature,
  temperatureConfig,
} from "./utils";

export const CallsTable = ({
  calls,
  statusMap,
  onPlayAudio,
  onViewAnalysis,
  formatDate,
}: CallsTableProps) => {
  const [selectedLead, setSelectedLead] = useState<LeadCalls | null>(null);
  const [showCallsHistory, setShowCallsHistory] = useState(false);

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

  const handleShowCallHistory = (lead: LeadCalls) => {
    setSelectedLead(lead);
    setShowCallsHistory(true);
  };

  const hasProcessedCalls = (calls: LeadCalls['calls']) => {
    return calls.some(call => call.status === "success" && call.analysis);
  };

  return (
    <TooltipProvider>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px] text-xs whitespace-nowrap">Nome do Lead</TableHead>
              <TableHead className="w-[120px] text-xs whitespace-nowrap">Status do Lead</TableHead>
              <TableHead className="w-[120px] text-xs whitespace-nowrap">Temperatura do Lead</TableHead>
              <TableHead className="w-[120px] text-xs whitespace-nowrap">Qtde de Chamadas</TableHead>
              <TableHead className="w-[180px] text-xs whitespace-nowrap">Funil (CRM)</TableHead>
              <TableHead className="w-[100px] text-xs whitespace-nowrap">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leadsWithCalls.map((lead) => {
              const leadStatus = getLeadStatus(lead.calls.length);
              const successfulCalls = lead.calls.filter(call => call.status === "success").length;
              const temperature = getLastCallTemperature(lead.calls);
              const tempConfig = temperature ? temperatureConfig[temperature] : null;
              const hasProcessed = hasProcessedCalls(lead.calls);

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
                    {hasProcessed ? (
                      <Badge
                        variant="secondary"
                        className={`flex items-center gap-0.5 w-fit text-[11px] px-1.5 py-0.5 ${tempConfig?.color}`}
                      >
                        <Flame className="w-3 h-3 mr-1" />
                        {tempConfig?.label}
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-0.5 w-fit text-[11px] px-1.5 py-0.5 bg-gray-100 text-gray-800"
                      >
                        <HelpCircle className="w-3 h-3 mr-1" />
                        Sem classificação
                      </Badge>
                    )}
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

      <CallHistory
        isOpen={showCallsHistory}
        onOpenChange={setShowCallsHistory}
        selectedLead={selectedLead}
        statusMap={statusMap}
        onPlayAudio={onPlayAudio}
        onViewAnalysis={onViewAnalysis}
        formatDate={formatDate}
      />
    </TooltipProvider>
  );
};
