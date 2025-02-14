
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
import { PhoneCall, GitFork } from "lucide-react";
import { Lead } from "@/types/leads";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { statusMap } from "@/constants/callStatus";

interface LeadsTableProps {
  leads: Lead[];
  onStartCall: (lead: Lead) => void;
}

export function LeadsTable({ leads, onStartCall }: LeadsTableProps) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showCallsHistory, setShowCallsHistory] = useState(false);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  const getLeadStatus = (callCount: number) => {
    return callCount === 0 ? "pending" : "contacted";
  };

  const handleShowCallHistory = (lead: Lead) => {
    setSelectedLead(lead);
    setShowCallsHistory(true);
  };

  return (
    <TooltipProvider>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Data de Cadastro</TableHead>
              <TableHead>Chamadas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Funil (CRM)</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{`${lead.firstName} ${lead.lastName || ''}`}</TableCell>
                <TableCell>{lead.contactValue}</TableCell>
                <TableCell>{formatDate(lead.createdAt)}</TableCell>
                <TableCell>
                  <Button
                    variant="link"
                    className="p-0 h-auto font-medium"
                    onClick={() => handleShowCallHistory(lead)}
                  >
                    {lead.callCount || 0}
                  </Button>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    getLeadStatus(lead.callCount) === 'contacted'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                  >
                    {getLeadStatus(lead.callCount) === 'contacted'
                      ? 'Ativo'
                      : 'Pendente'
                    }
                  </span>
                </TableCell>
                <TableCell>
                  {lead.callCount > 0 && lead.crmInfo ? (
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
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onStartCall(lead)}
                  >
                    <PhoneCall className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {leads.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Nenhum lead cadastrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showCallsHistory} onOpenChange={setShowCallsHistory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Histórico de Chamadas - {selectedLead?.firstName} {selectedLead?.lastName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedLead?.calls?.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedLead.calls.map((call) => {
                    const status = call.status === 'success' ? 'success' : 'failed';
                    const StatusIcon = statusMap[status].icon;
                    
                    return (
                      <TableRow key={call.id}>
                        <TableCell>{formatDate(call.date)}</TableCell>
                        <TableCell>{call.duration}</TableCell>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger>
                              <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${statusMap[status].color}`}>
                                <StatusIcon className="h-3 w-3" />
                                {statusMap[status].label}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                {statusMap[status].tooltip}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Nenhuma chamada registrada
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
