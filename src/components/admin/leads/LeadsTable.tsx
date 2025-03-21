
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { StickyNote, MessageCircle, Info } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    const statusConfig: Record<string, { color: string; label: string; description: string }> = {
      ganho: { 
        color: "bg-green-100 text-green-800", 
        label: "Ganho",
        description: "Lead que recebeu email de onboarding e concluiu o cadastro"
      },
      perda: { 
        color: "bg-red-100 text-red-800", 
        label: "Perda",
        description: "Lead que descartou o uso do SaaS"
      },
      nutricao_mkt: { 
        color: "bg-blue-100 text-blue-800", 
        label: "Nutrição Mkt",
        description: "Em processo de nutrição de marketing"
      },
      email_onboarding: { 
        color: "bg-yellow-100 text-yellow-800", 
        label: "Email Onboarding",
        description: "Recebeu email mas não finalizou cadastro"
      },
      contactar: { 
        color: "bg-gray-100 text-gray-800", 
        label: "Contactar",
        description: "Empresa que ainda não foi contactada"
      },
      qualificacao: { 
        color: "bg-purple-100 text-purple-800", 
        label: "Qualificação",
        description: "Empresa já contactada mas nada resolvido"
      },
    };

    const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800", label: status, description: "" };

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge className={`${config.color} hover:bg-opacity-80 cursor-help`}>
              {config.label}
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="top" align="center" className="z-50 bg-white p-2 shadow-md border rounded-md max-w-xs text-gray-800">
            <p className="text-sm font-medium">{config.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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
