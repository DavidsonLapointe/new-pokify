
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
import { PhoneCall } from "lucide-react";
import { Lead } from "@/types/leads";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Data de Cadastro</TableHead>
              <TableHead>Chamadas</TableHead>
              <TableHead>Status</TableHead>
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
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                    ${getLeadStatus(lead.callCount || 0) === 'contacted' 
                      ? 'bg-green-100 text-green-700' 
                      : getLeadStatus(lead.callCount || 0) === 'failed'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {getLeadStatus(lead.callCount || 0) === 'contacted' 
                      ? 'Ativo' 
                      : getLeadStatus(lead.callCount || 0) === 'failed'
                      ? 'Falhou'
                      : 'Pendente'
                    }
                  </span>
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
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
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
                  {selectedLead.calls.map((call) => (
                    <TableRow key={call.id}>
                      <TableCell>{formatDate(call.date)}</TableCell>
                      <TableCell>{call.duration}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                          ${call.status === 'success' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {call.status === 'success' ? 'Sucesso' : 'Falha'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
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
    </>
  );
}
