
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

interface LeadsTableProps {
  leads: Lead[];
  onStartCall: (lead: Lead) => void;
}

export function LeadsTable({ leads, onStartCall }: LeadsTableProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Data de Cadastro</TableHead>
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
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                  ${lead.status === 'contacted' 
                    ? 'bg-green-100 text-green-700' 
                    : lead.status === 'failed'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {lead.status === 'contacted' 
                    ? 'Contatado' 
                    : lead.status === 'failed'
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
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                Nenhum lead cadastrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
