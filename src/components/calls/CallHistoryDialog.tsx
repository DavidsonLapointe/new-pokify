
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LeadCalls } from "@/components/calls/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileAudio, FileVideo } from "lucide-react";

interface CallHistoryDialogProps {
  lead: LeadCalls;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formatDate: (date: string) => string;
}

export const CallHistoryDialog = ({
  lead,
  isOpen,
  onOpenChange,
  formatDate,
}: CallHistoryDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Histórico de Chamadas - {lead.personType === "pf"
              ? `${lead.firstName} ${lead.lastName}`
              : lead.razaoSocial}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lead.calls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell>{formatDate(call.date)}</TableCell>
                  <TableCell>{call.duration}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      {call.mediaType === "audio" ? (
                        <FileAudio className="h-4 w-4" />
                      ) : (
                        <FileVideo className="h-4 w-4" />
                      )}
                      {call.mediaType === "audio" ? "Áudio" : "Vídeo"}
                    </span>
                  </TableCell>
                  <TableCell>{call.phone}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        call.status === "success"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {call.status === "success" ? "Sucesso" : "Falha"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};
