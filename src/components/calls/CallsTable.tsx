
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { CallsTableProps, LeadCalls } from "./types";
import { CallHistory } from "./CallHistory";
import { UploadCallDialog } from "./UploadCallDialog";
import { LeadTemperatureBadge } from "./LeadTemperatureBadge";
import { LeadStatusBadge } from "./LeadStatusBadge";
import { LeadCRMInfo } from "./LeadCRMInfo";
import { LeadActionButtons } from "./LeadActionButtons";
import { getLeadName, getLeadStatus } from "./utils";

export const CallsTable = ({
  calls,
  statusMap,
  onPlayAudio,
  onViewAnalysis,
  formatDate,
}: CallsTableProps) => {
  const [selectedLead, setSelectedLead] = useState<LeadCalls | null>(null);
  const [showCallsHistory, setShowCallsHistory] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadLeadId, setUploadLeadId] = useState<string | null>(null);

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
      createdAt: call.date, // Using the first call date as registration date
    };

    return [...leads, newLead];
  }, []);

  const handleShowCallHistory = (lead: LeadCalls) => {
    setSelectedLead(lead);
    setShowCallsHistory(true);
  };

  const handleShowUpload = (lead: LeadCalls) => {
    setUploadLeadId(lead.id);
    setShowUpload(true);
  };

  const hasProcessedCalls = (calls: LeadCalls['calls']) => {
    return calls.some(call => call.status === "success" && call.analysis);
  };

  const handleUploadSuccess = () => {
    // Aqui você pode implementar a lógica de atualização da lista de chamadas
    // após um upload bem-sucedido
  };

  return (
    <TooltipProvider>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] text-xs whitespace-nowrap">Nome do Lead</TableHead>
              <TableHead className="w-[120px] text-xs whitespace-nowrap">Data de Cadastro</TableHead>
              <TableHead className="w-[120px] text-xs whitespace-nowrap">
                <div className="flex items-center gap-1">
                  Status do Lead
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>
                        <strong>Lead Ativo:</strong> Lead que possui pelo menos 1 arquivo de chamada registrado.<br />
                        <strong>Lead Pendente:</strong> Lead que ainda não possui nenhum arquivo de chamada.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TableHead>
              <TableHead className="w-[120px] text-xs whitespace-nowrap">Temperatura do Lead</TableHead>
              <TableHead className="w-[100px] text-xs whitespace-nowrap">Qtde de Chamadas</TableHead>
              <TableHead className="w-[160px] text-xs whitespace-nowrap">Funil (CRM)</TableHead>
              <TableHead className="w-[100px] text-xs whitespace-nowrap">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leadsWithCalls.map((lead) => {
              const leadStatus = getLeadStatus(lead.calls.length);
              const successfulCalls = lead.calls.filter(call => call.status === "success").length;
              const hasProcessed = hasProcessedCalls(lead.calls);

              return (
                <TableRow key={lead.id} className="text-xs">
                  <TableCell className="py-2 whitespace-nowrap">
                    {getLeadName(lead)}
                  </TableCell>
                  <TableCell className="py-2 whitespace-nowrap">
                    {formatDate(lead.createdAt)}
                  </TableCell>
                  <TableCell className="py-2 whitespace-nowrap">
                    <LeadStatusBadge status={leadStatus} />
                  </TableCell>
                  <TableCell className="py-2 whitespace-nowrap">
                    <LeadTemperatureBadge 
                      calls={lead.calls} 
                      hasProcessed={hasProcessed} 
                    />
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
                    <LeadCRMInfo 
                      successfulCalls={successfulCalls}
                      crmInfo={lead.crmInfo}
                    />
                  </TableCell>
                  <TableCell className="py-2">
                    <LeadActionButtons
                      lead={lead}
                      onShowHistory={handleShowCallHistory}
                      onShowUpload={handleShowUpload}
                    />
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

      {uploadLeadId && (
        <UploadCallDialog
          leadId={uploadLeadId}
          isOpen={showUpload}
          onOpenChange={(open) => {
            setShowUpload(open);
            if (!open) setUploadLeadId(null);
          }}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </TooltipProvider>
  );
};
