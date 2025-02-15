import { Call, StatusMap } from "@/types/calls";
import { LeadCalls } from "./types";
import { getLeadName, getLeadDetails } from "./utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PlayCircle, FileText, Video } from "lucide-react";
import { useState } from "react";
import { LeadDetailsDialog } from "./LeadDetailsDialog";
import { LeadTemperatureBadge } from "./LeadTemperatureBadge";
import { useToast } from "@/components/ui/use-toast";

interface CallHistoryProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLead: LeadCalls | null;
  statusMap: StatusMap;
  onPlayAudio: (audioUrl: string) => void;
  onViewAnalysis: (call: Call) => void;
  formatDate: (date: string) => string;
}

export const CallHistory = ({
  isOpen,
  onOpenChange,
  selectedLead,
  statusMap,
  onPlayAudio,
  onViewAnalysis,
  formatDate,
}: CallHistoryProps) => {
  const handleMediaPlay = (call: Call) => {
    onPlayAudio(call.audioUrl);
  };

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Histórico de Chamadas - {getLeadName(selectedLead)}
            </DialogTitle>
            <DialogDescription>
              {getLeadDetails(selectedLead)}
            </DialogDescription>
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
                  const isProcessing = call.status === "pending";
                  const MediaIcon = call.mediaType === "video" ? Video : PlayCircle;

                  return (
                    <TableRow key={call.id} className="text-xs">
                      <TableCell className="py-2">{formatDate(call.date)}</TableCell>
                      <TableCell className="py-2">{call.seller}</TableCell>
                      <TableCell className="py-2">{call.duration}</TableCell>
                      <TableCell className="py-2">
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant="secondary"
                              className={`flex items-center gap-0.5 w-fit text-[11px] px-1.5 py-0.5 ${status.color}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {status.label}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              {status.tooltip}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMediaPlay(call)}
                            className="hover:text-primary h-7 w-7"
                          >
                            <MediaIcon className="h-4 w-4" />
                          </Button>
                          
                          {call.status === "success" && call.analysis && (
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

      <LeadDetailsDialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        lead={selectedLead}
      />
    </TooltipProvider>
  );
};
