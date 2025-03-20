
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { StickyNote, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LeadlyLead } from "@/pages/AdminLeads";
import { Badge } from "@/components/ui/badge";

interface LeadsTableProps {
  leads: LeadlyLead[];
  onOpenNotes: (lead: LeadlyLead) => void;
}

export const LeadsTable = ({ leads, onOpenNotes }: LeadsTableProps) => {
  const formatCreatedAt = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      ganho: { color: "bg-green-100 text-green-800", label: "Ganho" },
      perda: { color: "bg-red-100 text-red-800", label: "Perda" },
      nutricao_mkt: { color: "bg-blue-100 text-blue-800", label: "Nutrição Mkt" },
      email_onboarding: { color: "bg-yellow-100 text-yellow-800", label: "Email Onboarding" },
      contactar: { color: "bg-gray-100 text-gray-800", label: "Contactar" },
      qualificacao: { color: "bg-purple-100 text-purple-800", label: "Qualificação" },
    };

    const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800", label: status };

    return (
      <Badge className={`${config.color} hover:${config.color}`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Cadastrado</TableHead>
            <TableHead>Anotações</TableHead>
            <TableHead className="w-[80px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length > 0 ? (
            leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>{getStatusBadge(lead.status)}</TableCell>
                <TableCell>{lead.phone}</TableCell>
                <TableCell>{formatCreatedAt(lead.createdAt)}</TableCell>
                <TableCell>{lead.notes.length}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onOpenNotes(lead)}
                    title="Anotações"
                  >
                    <StickyNote className="h-4 w-4 text-[#7E69AB]" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Nenhum lead encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
